/**
 * The browser's side of the gateway. It owns the retry rules, so no screen can get them wrong:
 *
 *  · a delivery that is lost is sent again with the SAME identifier (it can never be charged twice)
 *  · a new identifier means a new, possibly charged, attempt, and happens only on the visitor's wish
 *
 * Nothing is kept in the browser; the session lives in a cookie this code cannot read.
 */
import { parseResponse, type AssistantResponse, type ErrorCode, type ResponseError } from "./contract.ts";
import { readEvents } from "./sse.ts";

type Deps = { fetch?: typeof fetch; uuid?: () => string; wait?: (ms: number) => Promise<void> };

const DELIVERIES = 4;

export function createAiClient(deps: Deps = {}) {
  const call = deps.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  const uuid = deps.uuid ?? (() => crypto.randomUUID());
  const wait = deps.wait ?? ((ms: number) => new Promise<void>((done) => setTimeout(done, ms)));

  const post = (path: string, body: unknown, signal?: AbortSignal) =>
    call(`/api/ai/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "same-origin", cache: "no-store", signal });

  const failure = (requestId: string, code: ErrorCode, retry: ResponseError["retry"], retryAfter?: number): AssistantResponse => ({
    contract: "codeshaper.ai.response", version: 1, request_id: requestId, message_id: null, status: "error", replayed: false, text: "", sources: [], actions: [], components: [], session: null,
    error: { code, retryable: retry !== "none", retry, ...(retryAfter === undefined ? {} : { retry_after: retryAfter }) },
  });

  /** One delivery. Null means: unknown, ask again with the same identifier. */
  async function once(body: { request_id: string }, onText: (t: string) => void, signal?: AbortSignal): Promise<AssistantResponse | null> {
    const r = await post("messages", body, signal);
    if ((r.headers.get("content-type") ?? "").startsWith("text/event-stream") && r.body) {
      const reader = r.body.getReader();
      try {
        for await (const { event, data } of readEvents(reader)) {
          const parsed = JSON.parse(data);
          if (event === "delta" && typeof parsed.text === "string") onText(parsed.text);
          if (event === "done") return parseResponse(parsed);
          if (event === "error") {
            const answer = parseResponse(parsed);
            // the gateway lost the thread: the CMS may well have the answer. Any other refusal is the answer.
            const lost = answer?.error?.retry === "same_id" && (answer.error.code === "unavailable" || answer.error.code === "invalid_response");
            return lost ? null : answer;
          }
        }
        return null;
      } finally {
        reader.cancel().catch(() => {});
      }
    }
    const data = await r.json();
    const answer = parseResponse(data);
    if (answer) return answer;
    const e = data?.error as ResponseError | undefined;
    return e && typeof e.code === "string" ? failure(body.request_id, e.code, e.retry ?? "none", e.retry_after) : null;
  }

  async function deliver(body: { request_id: string } & Record<string, unknown>, onText: (t: string) => void, signal?: AbortSignal): Promise<AssistantResponse> {
    let last: AssistantResponse | null = null;
    let streamed = false;
    for (let i = 0; i < DELIVERIES; i++) {
      if (signal?.aborted) return failure(body.request_id, "cancelled", "same_id");
      try {
        // after pieces were shown, a later answer replaces them whole rather than adding to them
        last = await once(body, (t) => ((streamed = true), i === 0 && onText(t)), signal);
      } catch {
        last = null;
      }
      const code = last?.error?.code;
      if (last && !(code === "in_progress" || (code === "unavailable" && last.error?.retry === "same_id" && !streamed))) return last;
      if (i < DELIVERIES - 1) await wait((last?.error?.retry_after ?? i + 1) * 1000);
    }
    return last ?? failure(body.request_id, "unavailable", "same_id");
  }

  /** The server's own idea of now, from the answer's Date header. */
  const serverTime = (r: Response) => {
    const ms = Date.parse(r.headers.get("date") ?? "");
    return Number.isFinite(ms) ? ms : null;
  };

  const session = async (r: Response) => {
    const data = await r.json().catch(() => null);
    return { ok: r.ok, session: data?.session ?? null, error: (data?.error ?? null) as ResponseError | null, serverNow: serverTime(r) };
  };

  return {
    /** Starts (or keeps) a session after the visitor accepted that version of the notice. */
    start: async (noticeVersion: string, fresh = false) => session(await post("session", { notice_version: noticeVersion, ...(fresh ? { fresh } : {}) })),
    /** A new token and a fresh idle period, never past the longest life. */
    renew: async () => session(await post("session/renew", {})),
    /** The conversation the cookie belongs to, for a reloaded page. */
    async restore() {
      const r = await call("/api/ai/session", { credentials: "same-origin", cache: "no-store" });
      return r.ok ? { ...(await r.json()), serverNow: serverTime(r) } : null;
    },
    end: () => call("/api/ai/session", { method: "DELETE", credentials: "same-origin" }),
    send: (text: string, onText: (t: string) => void = () => {}, options: { signal?: AbortSignal; requestId?: string } = {}) =>
      deliver({ request_id: options.requestId ?? uuid(), text, stream: true }, onText, options.signal),
    /** The visitor asked for another try at a request that failed. It may be charged. */
    newAttempt: (retryOf: string, onText: (t: string) => void = () => {}, signal?: AbortSignal, requestId?: string) =>
      deliver({ request_id: requestId ?? uuid(), retry_of: retryOf, stream: true }, onText, signal),
    /** Asks the server to stop. A call already made may still be charged. */
    cancel: (requestId: string) => post(`messages/${requestId}/cancel`, {}),
  };
}
