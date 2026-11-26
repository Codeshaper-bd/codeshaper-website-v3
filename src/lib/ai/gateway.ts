/**
 * The website's side of the AI: the browser talks only to /api/ai here, and this server talks to the
 * CMS's internal AI routes with signed requests (codeshaper-cms docs/ai/gateway.md). It decides
 * nothing about answers, money or sessions: the CMS does. It checks what comes in, keeps the session
 * token in a cookie scripts cannot read, and passes on only what fits the contract.
 *
 * Server only. No framework imports, so the tests can run it as it is.
 */
import { createHash, createHmac, randomBytes } from "node:crypto";
import { createLimiter, type Bucket } from "../rateLimit.ts";
import { ERROR_CODES, parseResponse, RETRIES, type AssistantResponse, type ErrorCode, type ResponseError } from "./contract.ts";
import { readEvents } from "./sse.ts";

export type Operation = "status" | "session.create" | "session.show" | "session.renew" | "session.end" | "messages.send" | "messages.show" | "messages.cancel";

type Deps = {
  env?: () => Record<string, string | undefined>;
  fetch?: typeof fetch;
  now?: () => number;
  /** one line, no visitor words and no secret */
  log?: (line: string) => void;
};

const COOKIE = "__Host-cs_ai";
const COOKIE_RULES = "HttpOnly; Secure; SameSite=Strict";
const BODY_MAX = 16_000;
const ANSWER_MAX = 64_000;
const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const TOKEN = /^[A-Za-z0-9_-]{43}$/;

type Route = { method: "GET" | "POST" | "DELETE"; path: (id: string) => string; bucket: Bucket; fields?: (b: Record<string, unknown>) => boolean; timeoutMs: number };

const only = (b: Record<string, unknown>, keys: string[]) => Object.keys(b).every((k) => keys.includes(k));
const nothing = (b: Record<string, unknown>) => only(b, []);

const ROUTES: Record<Operation, Route> = {
  status: { method: "GET", path: () => "status", bucket: "ai", timeoutMs: 5_000 },
  "session.create": {
    method: "POST", path: () => "session", bucket: "aiSession", timeoutMs: 10_000,
    fields: (b) => only(b, ["notice_version", "fresh"]) && typeof b.notice_version === "string" && b.notice_version.length <= 40 && ["undefined", "boolean"].includes(typeof b.fresh),
  },
  "session.show": { method: "GET", path: () => "session", bucket: "ai", timeoutMs: 10_000 },
  "session.renew": { method: "POST", path: () => "session/renew", bucket: "aiSession", fields: nothing, timeoutMs: 10_000 },
  "session.end": { method: "DELETE", path: () => "session", bucket: "ai", timeoutMs: 10_000 },
  // a little longer than the CMS allows a provider
  "messages.send": {
    method: "POST", path: () => "messages", bucket: "ai", timeoutMs: 60_000,
    fields: (b) =>
      only(b, ["request_id", "text", "retry_of", "stream"]) && typeof b.request_id === "string" && UUID.test(b.request_id) && typeof b.stream === "boolean" &&
      (b.text === undefined) !== (b.retry_of === undefined) &&
      (b.text === undefined ? typeof b.retry_of === "string" && UUID.test(b.retry_of) : typeof b.text === "string" && b.text.trim().length > 0 && [...b.text].length <= 1500),
  },
  "messages.show": { method: "GET", path: (id) => `messages/${id}`, bucket: "ai", timeoutMs: 10_000 },
  "messages.cancel": { method: "POST", path: (id) => `messages/${id}/cancel`, bucket: "ai", fields: nothing, timeoutMs: 10_000 },
};

const STATUS: Partial<Record<ErrorCode, number>> = { invalid_request: 422, too_large: 413, forbidden: 403, not_found: 404, session_expired: 401, rate_limited: 429, ai_disabled: 503, unavailable: 503 };
const base = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

const reply = (body: unknown, status = 200, cookie?: string) =>
  new Response(body === null ? null : JSON.stringify(body), { status, headers: { ...base, ...(body === null ? {} : { "Content-Type": "application/json" }), ...(cookie ? { "Set-Cookie": cookie } : {}) } });

const refuse = (code: ErrorCode, status = STATUS[code] ?? 400, extra: Partial<ResponseError> = {}, cookie?: string) => {
  const retry = extra.retry ?? (code === "unavailable" || code === "rate_limited" ? "same_id" : "none");
  return reply({ error: { code, retryable: retry !== "none", ...extra, retry } }, status, cookie);
};

const clearCookie = `${COOKIE}=; Path=/; Max-Age=0; ${COOKIE_RULES}`;
const isRec = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** A page of this website made the request: the browser's own words for it, which a page cannot forge. */
function fromOurPage(request: Request, changes: boolean): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && !(site === "none" && !changes)) return false;
  if (!changes) return true;
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  try {
    return !!origin && !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function readBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const parts: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > BODY_MAX) {
      await reader.cancel();
      return null;
    }
    parts.push(value);
  }
  return Buffer.concat(parts).toString("utf8");
}

const sessionShape = (v: unknown) =>
  isRec(v) && typeof v.expires_at === "string" && typeof v.idle_expires_at === "string" && Number.isInteger(v.turns_left) && Number.isInteger(v.max_chars)
    ? { expires_at: v.expires_at, idle_expires_at: v.idle_expires_at, turns_left: v.turns_left as number, max_chars: v.max_chars as number }
    : null;

export function createGateway(deps: Deps = {}) {
  const env = deps.env ?? (() => process.env);
  const call = deps.fetch ?? fetch;
  const now = deps.now ?? Date.now;
  const write = deps.log ?? ((line: string) => console.warn(line));
  const limited = createLimiter(now);
  const logged = new Map<string, number>();
  /** the same trouble is written once a minute, not once a request */
  const log = (what: string) => {
    if (now() - (logged.get(what) ?? -Infinity) < 60_000) return;
    logged.set(what, now());
    write(`[ai] ${what}`);
  };

  /** @param id the message identifier of the two routes that name one */
  return async function handle(operation: Operation, request: Request, id = ""): Promise<Response> {
    const e = env();
    const key = e.CMS_TOKEN_AI_GATEWAY ?? "";
    const cms = (e.AI_CMS_URL || e.CMS_URL || "").replace(/\/$/, "");
    if (e.AI_GATEWAY_ENABLED !== "1" || key.length < 32 || !cms) return refuse("not_found");

    const route = ROUTES[operation];
    if (request.method !== route.method) return refuse("invalid_request", 405);
    if (operation.startsWith("messages.") && operation !== "messages.send" && !UUID.test(id)) return refuse("not_found");
    const changes = route.method !== "GET";
    if (!fromOurPage(request, changes)) return refuse("forbidden");
    if (route.method === "POST" && (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase() !== "application/json") return refuse("invalid_request", 415);
    if (limited(request.headers, route.bucket)) return refuse("rate_limited", 429, { retry_after: 600 });

    let body = "";
    let wantsStream = false;
    if (route.fields) {
      const raw = await readBody(request);
      if (raw === null) return refuse("too_large");
      let data: unknown;
      try {
        data = JSON.parse(raw || "{}");
      } catch {
        return refuse("invalid_request");
      }
      if (!isRec(data) || !route.fields(data)) return refuse("invalid_request");
      wantsStream = data.stream === true;
      body = JSON.stringify(data);
    }

    const cookie = (request.headers.get("cookie") ?? "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
    const token = cookie && TOKEN.test(cookie) ? cookie : undefined;
    // the address our own nginx saw, hashed with the day: the CMS can count a visitor without knowing who
    const address = request.headers.get("x-real-ip")?.trim() || request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
    const client = createHmac("sha256", key).update(`client|${new Date(now()).toISOString().slice(0, 10)}|${address}`).digest("hex");

    const path = `/api/ai/v1/${route.path(id.toLowerCase())}`;
    const time = String(Math.floor(now() / 1000));
    const nonce = randomBytes(16).toString("base64url");
    const sha = (v: string) => createHash("sha256").update(v).digest("hex");
    const signature = createHmac("sha256", key).update(["v1", route.method, path, time, nonce, sha(body), token ? sha(token) : "-", client].join("\n")).digest("hex");

    let upstream: Response;
    try {
      upstream = await call(cms + path, {
        method: route.method,
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
          "X-CS-Timestamp": time, "X-CS-Nonce": nonce, "X-CS-Signature": signature, "X-CS-Client": client,
          ...(token ? { "X-CS-Session": token } : {}),
        },
        body: body || undefined,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(route.timeoutMs),
      });
    } catch {
      log(`${operation}: the CMS could not be reached`);
      return refuse("unavailable", 503);
    }

    if (upstream.ok && wantsStream && upstream.body && (upstream.headers.get("content-type") ?? "").startsWith("text/event-stream")) {
      return stream(upstream.body, log);
    }
    if (upstream.status === 204 && operation === "session.end") return reply(null, 204, clearCookie);

    let data: unknown = null;
    try {
      data = await upstream.json();
    } catch {
      /* handled below */
    }
    if (!upstream.ok) {
      const error = isRec(data) && isRec(data.error) ? data.error : null;
      if (error && (ERROR_CODES as readonly unknown[]).includes(error.code)) {
        const code = error.code as ErrorCode;
        const retry = (RETRIES as readonly unknown[]).includes(error.retry) ? (error.retry as ResponseError["retry"]) : undefined;
        const wait = Number.isInteger(error.retry_after) ? { retry_after: error.retry_after as number } : {};
        return refuse(code, upstream.status, { retry, ...wait }, code === "session_expired" ? clearCookie : undefined);
      }
      // a refused signature or a fault: our business, not the visitor's
      log(`${operation}: the CMS answered ${upstream.status}`);
      return refuse("unavailable", 502);
    }

    const invalid = () => {
      log(`${operation}: the CMS answer did not fit`);
      return refuse("invalid_response", 502);
    };
    if (!isRec(data)) return invalid();
    switch (operation) {
      case "status":
        return typeof data.text === "boolean" ? reply({ text: data.text }) : invalid();
      case "session.create":
      case "session.renew": {
        const session = sessionShape(data.session);
        if (!session) return invalid();
        if (data.session_token === undefined) return reply({ session });
        if (typeof data.session_token !== "string" || !TOKEN.test(data.session_token)) return invalid();
        const life = Math.max(0, Math.min(86_400, Math.floor((Date.parse(session.expires_at) - now()) / 1000)));
        return reply({ session }, upstream.status, `${COOKIE}=${data.session_token}; Path=/; Max-Age=${life}; ${COOKIE_RULES}`);
      }
      case "session.show": {
        const session = sessionShape(data.session);
        if (!session || !Array.isArray(data.messages)) return invalid();
        const messages = data.messages.flatMap((m) => {
          const response = isRec(m) ? parseResponse(m.response) : null;
          return isRec(m) && typeof m.request_id === "string" && typeof m.text === "string" && response ? [{ request_id: m.request_id, text: m.text, response }] : [];
        });
        return reply({ session, messages });
      }
      case "messages.cancel":
        return reply({ ok: true }, 202);
      default: {
        const answer = parseResponse(data);
        return answer ? reply(answer) : invalid();
      }
    }
  };
}

/**
 * Passes the CMS's events on one at a time, each checked and rebuilt. Anything unexpected ends the
 * stream with an error. If it breaks off, the browser asks again with the same identifier: the CMS
 * finishes and keeps the answer whether or not anyone is still reading.
 */
function stream(from: ReadableStream<Uint8Array>, log: (what: string) => void): Response {
  const reader = from.getReader();
  const events = readEvents(reader);
  const encoder = new TextEncoder();
  let requestId = "";
  let sent = 0;
  let over = false;

  const out = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const send = (event: string, data: unknown) => controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      const finish = () => {
        over = true;
        controller.close();
        reader.cancel().catch(() => {});
      };
      const fail = (code: ErrorCode, retry: ResponseError["retry"], why: string) => {
        log(`messages.send: ${why}`);
        const error: AssistantResponse = { contract: "codeshaper.ai.response", version: 1, request_id: requestId || "unknown", message_id: null, status: "error", replayed: false, text: "", sources: [], actions: [], components: [], error: { code, retryable: retry !== "none", retry }, session: null };
        send("error", error);
        finish();
      };
      try {
        const next = await events.next();
        if (over) return;
        if (next.done) return fail("unavailable", "same_id", "the stream ended early");
        const { event, data } = next.value;
        const parsed: unknown = JSON.parse(data);
        if (event === "start" && !requestId && isRec(parsed) && typeof parsed.request_id === "string" && UUID.test(parsed.request_id) && typeof parsed.message_id === "string") {
          requestId = parsed.request_id;
          return send("start", { request_id: requestId, message_id: parsed.message_id.slice(0, 40) });
        }
        if (event === "delta" && requestId && isRec(parsed) && typeof parsed.text === "string") {
          sent += parsed.text.length;
          if (sent <= ANSWER_MAX) return send("delta", { text: parsed.text });
        }
        if (event === "done" || event === "error") {
          const answer = parseResponse(parsed);
          if (answer && (answer.status === "error") === (event === "error")) {
            send(event, answer);
            return finish();
          }
        }
        fail("invalid_response", "same_id", "an event did not fit");
      } catch (e) {
        if (!over) fail(e instanceof SyntaxError ? "invalid_response" : "unavailable", "same_id", "the stream broke");
      }
    },
    cancel() {
      over = true;
      return reader.cancel().catch(() => {});
    },
  });

  return new Response(out, { headers: { ...base, "Content-Type": "text/event-stream; charset=utf-8", "X-Accel-Buffering": "no", "Cache-Control": "no-store, no-transform" } });
}
