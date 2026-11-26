import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { createGateway } from "../src/lib/ai/gateway.ts";

const KEY = "synthetic-gateway-key-0000000000000000000000";
const TOKEN = "T".repeat(43);
const ID = "9a3c1a2e-0f43-4a8e-9d0b-6a2f2f0d7e11";
const ENV = { AI_GATEWAY_ENABLED: "1", CMS_TOKEN_AI_GATEWAY: KEY, CMS_URL: "http://cms.internal:8090" };
const sha = (v) => createHash("sha256").update(v).digest("hex");

const answer = (more = {}) => ({ contract: "codeshaper.ai.response", version: 1, request_id: ID, message_id: "m1", status: "completed", replayed: false, text: "Hi", sources: [], actions: [], components: [], error: null, session: { expires_at: "2026-11-27T10:00:00Z", turns_left: 19 }, ...more });
const session = { expires_at: "2026-11-27T10:00:00Z", idle_expires_at: "2026-11-26T10:30:00Z", turns_left: 20, max_chars: 1500 };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const sse = (text) => new Response(text, { headers: { "content-type": "text/event-stream; charset=utf-8" } });
const event = (name, data) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;

function setup(reply = () => json(answer()), env = ENV) {
  const sent = [];
  const logs = [];
  const gateway = createGateway({
    env: () => env,
    fetch: async (url, init) => (sent.push({ url: String(url), init, headers: init.headers }), reply(url, init)),
    now: () => Date.parse("2026-11-26T10:00:00Z"),
    log: (line) => logs.push(line),
  });
  return { gateway, sent, logs };
}
const request = (path, { method = "POST", body, headers = {}, cookie, origin = "https://codeshaper.test" } = {}) =>
  new Request(`https://codeshaper.test/api/ai/${path}`, {
    method,
    headers: { host: "codeshaper.test", ...(method === "GET" ? {} : { "content-type": "application/json", ...(origin ? { origin } : {}) }), "x-real-ip": "198.51.100.7", ...(cookie ? { cookie: `__Host-cs_ai=${cookie}` } : {}), ...headers },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
const send = (extra = {}) => request("messages", { body: { request_id: ID, text: "SECRET-VISITOR-WORDS", stream: false }, cookie: TOKEN, ...extra });
const code = async (r) => (await r.json()).error?.code;

test("off by default: without the switch, the key and the address there is nothing there", async () => {
  for (const env of [{}, { ...ENV, AI_GATEWAY_ENABLED: "true" }, { ...ENV, CMS_TOKEN_AI_GATEWAY: "short" }, { ...ENV, CMS_TOKEN_AI_GATEWAY: undefined }, { ...ENV, CMS_URL: undefined }]) {
    const { gateway, sent } = setup(undefined, env);
    assert.equal((await gateway("status", request("status", { method: "GET" }))).status, 404);
    assert.equal(sent.length, 0);
  }
});

test("it signs what it sends exactly as the CMS checks it, and never sends the key", async () => {
  const { gateway, sent } = setup();
  await gateway("messages.send", send());
  const { url, init, headers } = sent[0];
  assert.equal(url, "http://cms.internal:8090/api/ai/v1/messages");
  const signed = ["v1", "POST", "/api/ai/v1/messages", headers["X-CS-Timestamp"], headers["X-CS-Nonce"], sha(init.body), sha(TOKEN), headers["X-CS-Client"]].join("\n");
  assert.equal(headers["X-CS-Signature"], createHmac("sha256", KEY).update(signed).digest("hex"));
  assert.equal(headers["X-CS-Session"], TOKEN);
  assert.match(headers["X-CS-Nonce"], /^[A-Za-z0-9_-]{22,64}$/);
  assert.match(headers["X-CS-Client"], /^[0-9a-f]{64}$/);
  assert.ok(!JSON.stringify(sent[0]).includes(KEY));
  assert.ok(!JSON.stringify(sent[0]).includes("198.51.100.7"), "the visitor's address is not passed on");
  await gateway("messages.send", send());
  assert.notEqual(sent[1].headers["X-CS-Nonce"], headers["X-CS-Nonce"]);
});

test("the visitor is told apart by the proxy's address only, and an unknown one is shared", async () => {
  const { gateway, sent } = setup();
  const client = async (headers) => (await gateway("messages.send", send({ headers })), sent.at(-1).headers["X-CS-Client"]);
  const a = await client({ "x-real-ip": "198.51.100.1" });
  assert.notEqual(await client({ "x-real-ip": "198.51.100.2" }), a);
  assert.equal(await client({ "x-real-ip": "198.51.100.1", "x-cs-client": "f".repeat(64) }), a);
  assert.equal(await client({ "x-real-ip": "" }), await client({ "x-real-ip": "" }));
});

test("only our own pages may change anything", async () => {
  const { gateway, sent } = setup();
  for (const extra of [
    { origin: "https://evil.test" }, { origin: null }, { origin: "null" }, { origin: "https://codeshaper.test.evil.test" },
    { headers: { "sec-fetch-site": "cross-site" } }, { headers: { "sec-fetch-site": "same-site" } },
  ]) assert.equal((await gateway("messages.send", send(extra))).status, 403, JSON.stringify(extra));
  assert.equal((await gateway("messages.send", send({ headers: { "content-type": "text/plain" } }))).status, 415);
  assert.equal((await gateway("session.show", request("session", { method: "GET", cookie: TOKEN, headers: { "sec-fetch-site": "cross-site" } }))).status, 403);
  assert.equal(sent.length, 0);
});

test("only the expected fields, sizes and methods pass", async () => {
  const { gateway, sent } = setup();
  const bad = [
    { request_id: "x", text: "a", stream: false }, { request_id: ID, stream: false }, { request_id: ID, text: "a", retry_of: ID, stream: false }, { request_id: ID, text: "  ", stream: false },
    { request_id: ID, text: "a".repeat(1501), stream: false }, { request_id: ID, text: "a", stream: "yes" }, { request_id: ID, text: "a", stream: false, role: "assistant" }, { request_id: ID, text: "a", stream: false, synthetic: true },
  ];
  for (const body of bad) assert.equal((await gateway("messages.send", send({ body }))).status, 422, JSON.stringify(body).slice(0, 80));
  assert.equal((await gateway("messages.send", send({ body: "[1]" }))).status, 422);
  assert.equal((await gateway("messages.send", send({ body: "{" }))).status, 422);
  assert.equal((await gateway("messages.send", send({ body: JSON.stringify({ request_id: ID, text: "a", stream: false, pad: "x".repeat(20_000) }) }))).status, 413);
  assert.equal((await gateway("messages.send", request("messages", { method: "PUT", body: {} }))).status, 405);
  assert.equal((await gateway("messages.show", request("messages/../x", { method: "GET", cookie: TOKEN }), "../status")).status, 404);
  assert.equal(sent.length, 0);
});

test("the session token goes into a locked-down cookie and never into the page", async () => {
  const { gateway, sent } = setup(() => json({ session_token: TOKEN, session }, 201));
  const r = await gateway("session.create", request("session", { body: { notice_version: "dev-2026-11-26" } }));
  assert.equal(r.status, 201);
  assert.deepEqual(await r.json(), { session });
  assert.equal(r.headers.get("set-cookie"), `__Host-cs_ai=${TOKEN}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict`);
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.equal(sent[0].headers["X-CS-Session"], undefined);
});

test("a planted or malformed cookie is not passed on", async () => {
  const { gateway, sent } = setup();
  await gateway("messages.send", send({ cookie: "short" }));
  await gateway("messages.send", request("messages", { body: { request_id: ID, text: "a", stream: false }, headers: { cookie: `cs_ai=${TOKEN}` } }));
  assert.deepEqual(sent.map((s) => s.headers["X-CS-Session"]), [undefined, undefined]);
});

test("ending a session and an expired one both clear the cookie", async () => {
  const gone = /^__Host-cs_ai=; Path=\/; Max-Age=0; HttpOnly; Secure; SameSite=Strict$/;
  const ended = await setup(() => new Response(null, { status: 204 })).gateway("session.end", request("session", { method: "DELETE", cookie: TOKEN }));
  assert.equal(ended.status, 204);
  assert.match(ended.headers.get("set-cookie"), gone);
  const expired = await setup(() => json({ error: { code: "session_expired", retryable: false, retry: "none" } }, 401)).gateway("session.show", request("session", { method: "GET", cookie: TOKEN }));
  assert.equal(expired.status, 401);
  assert.match(expired.headers.get("set-cookie"), gone);
});

test("only safe, known errors come back", async () => {
  const through = async (reply) => {
    const { gateway, logs } = setup(reply);
    const r = await gateway("messages.send", send());
    const text = await r.text();
    assert.doesNotMatch(text + logs.join(), /SQLSTATE|stack|SECRET|internal/);
    return [r.status, JSON.parse(text).error.code];
  };
  assert.deepEqual(await through(() => json({ error: { code: "rate_limited", retryable: true, retry: "none", retry_after: 60, trace: "stack" } }, 429)), [429, "rate_limited"]);
  assert.deepEqual(await through(() => json({ message: "SQLSTATE internal" }, 500)), [502, "unavailable"]);
  assert.deepEqual(await through(() => json({ message: "Unauthenticated." }, 401)), [502, "unavailable"]);
  assert.deepEqual(await through(() => new Response("<html>stack</html>", { status: 200 })), [502, "invalid_response"]);
  assert.deepEqual(await through(() => json({ ...answer(), contract: "other" })), [502, "invalid_response"]);
  assert.deepEqual(await through(() => { throw new Error("connect ECONNREFUSED internal"); }), [503, "unavailable"]);
});

test("an answer is checked and anything outside the contract is removed", async () => {
  const { gateway } = setup(() => json(answer({ components: [{ type: "html", html: "<img>" }, { type: "consultation" }], debug: "x" })));
  const body = await (await gateway("messages.send", send())).json();
  assert.deepEqual(body.components, [{ type: "consultation" }]);
  assert.equal(body.debug, undefined);
});

const streamed = async (upstream) => {
  const { gateway, logs } = setup(() => (typeof upstream === "function" ? upstream() : sse(upstream)));
  const r = await gateway("messages.send", send({ body: { request_id: ID, text: "a", stream: true } }));
  const text = await r.text();
  return { r, text, logs, events: [...text.matchAll(/^event: (\w+)\ndata: (.*)\n\n/gm)].map((m) => [m[1], JSON.parse(m[2])]) };
};
const start = event("start", { request_id: ID, message_id: "m1" });

test("a stream passes through, checked piece by piece", async () => {
  const { r, events } = await streamed(start + event("delta", { text: "Hi", extra: 1 }) + event("done", answer()));
  assert.match(r.headers.get("content-type"), /^text\/event-stream/);
  assert.equal(r.headers.get("x-accel-buffering"), "no");
  assert.deepEqual(events.map((e) => e[0]), ["start", "delta", "done"]);
  assert.deepEqual(events[1][1], { text: "Hi" });
});

test("a stream split at every byte, with multibyte characters, arrives whole", async () => {
  const bytes = new TextEncoder().encode(start + event("delta", { text: "বাংলা 😀" }) + event("done", answer()));
  const { events } = await streamed(() => new Response(new ReadableStream({ start(c) { for (const b of bytes) c.enqueue(new Uint8Array([b])); c.close(); } }), { headers: { "content-type": "text/event-stream" } }));
  assert.equal(events[1][1].text, "বাংলা 😀");
});

test("invalid or unknown events end the stream safely", async () => {
  for (const bad of [
    "event: delta\ndata: not json\n\n", event("delta", { text: 5 }), event("script", { code: "x" }), event("done", { ...answer(), contract: "other" }),
    event("done", answer({ status: "error", text: "", message_id: null, error: { code: "busy", retryable: true, retry: "same_id" } })), event("delta", { text: "x".repeat(70_000) }),
  ]) {
    const { events } = await streamed(start + bad + event("delta", { text: "after" }) + event("done", answer()));
    assert.deepEqual(events.map((e) => e[0]), ["start", "error"], bad.slice(0, 40));
    assert.equal(events.at(-1)[1].error.code, "invalid_response");
  }
});

test("a stream that breaks off tells the browser to ask again with the same identifier", async () => {
  for (const upstream of [start + event("delta", { text: "Ha" }), () => new Response(new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(start)); }, pull(c) { c.error(new Error("reset internal")); } }), { headers: { "content-type": "text/event-stream" } })]) {
    const { events, text } = await streamed(upstream);
    assert.equal(events.at(-1)[0], "error");
    assert.deepEqual([events.at(-1)[1].error.code, events.at(-1)[1].error.retry], ["unavailable", "same_id"]);
    assert.doesNotMatch(text, /internal/);
  }
});

test("a browser that goes away stops the gateway reading", async () => {
  let cancelled = false;
  const { gateway } = setup(() => new Response(new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(start)); }, cancel() { cancelled = true; } }), { headers: { "content-type": "text/event-stream" } }));
  const r = await gateway("messages.send", send({ body: { request_id: ID, text: "a", stream: true } }));
  const reader = r.body.getReader();
  await reader.read();
  await reader.cancel();
  await new Promise((done) => setTimeout(done, 20));
  assert.ok(cancelled);
});

test("each visitor and everyone together have a limit, and it is checked before the CMS is asked", async () => {
  const { gateway, sent } = setup(() => json({ session_token: TOKEN, session }, 201));
  const create = (ip) => gateway("session.create", request("session", { body: { notice_version: "n" }, headers: { "x-real-ip": ip } }));
  for (let i = 0; i < 10; i++) assert.equal((await create("198.51.100.9")).status, 201);
  const refused = await create("198.51.100.9");
  assert.equal(refused.status, 429);
  assert.equal(await code(refused), "rate_limited");
  assert.equal(sent.length, 10);
  assert.equal((await create("198.51.100.10")).status, 201);
});

test("nothing the visitor typed and no secret is ever logged", async () => {
  const { gateway, logs } = setup(() => { throw new Error(`boom ${KEY} SECRET-VISITOR-WORDS`); });
  await gateway("messages.send", send());
  assert.equal(logs.length, 1);
  assert.doesNotMatch(logs[0], new RegExp(`${KEY}|${TOKEN}|SECRET|198\\.51`));
});
