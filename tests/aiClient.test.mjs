import { test } from "node:test";
import assert from "node:assert/strict";
import { createAiClient } from "../src/lib/ai/client.ts";

const ID = "9a3c1a2e-0f43-4a8e-9d0b-6a2f2f0d7e11";
const answer = (more = {}) => ({ contract: "codeshaper.ai.response", version: 1, request_id: ID, message_id: "m1", status: "completed", replayed: false, text: "Hi there", sources: [], actions: [], components: [], error: null, session: null, ...more });
const failed = (code, retry) => answer({ status: "error", message_id: null, text: "", error: { code, retryable: retry !== "none", retry } });
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const event = (name, data) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
const sse = (text) => new Response(text, { headers: { "content-type": "text/event-stream" } });

function setup(...replies) {
  const sent = [];
  let n = 0;
  const ids = [ID, "1b0d2f0e-6a0e-4a53-9a55-0a1c8a6f1a99"];
  const client = createAiClient({
    fetch: async (url, init = {}) => {
      sent.push({ url, method: init.method ?? "GET", body: init.body ? JSON.parse(init.body) : null });
      const r = replies[Math.min(n++, replies.length - 1)];
      return typeof r === "function" ? r() : r;
    },
    uuid: () => ids.shift(),
    wait: async () => {},
  });
  return { client, sent };
}

test("a streamed answer hands over the pieces and ends with the checked whole", async () => {
  const { client } = setup(sse(event("start", { request_id: ID, message_id: "m1" }) + event("delta", { text: "Hi " }) + event("delta", { text: "there" }) + event("done", answer())));
  const pieces = [];
  const r = await client.send("Hello", (t) => pieces.push(t));
  assert.deepEqual([pieces, r.text, r.status], [["Hi ", "there"], "Hi there", "completed"]);
});

test("an answer sent whole works the same: the fallback without streaming", async () => {
  const { client } = setup(json(answer()));
  assert.equal((await client.send("Hello")).text, "Hi there");
});

test("a lost connection is retried with the same identifier, never a new one", async () => {
  const { client, sent } = setup(() => { throw new Error("offline"); }, json(answer({ replayed: true })));
  const r = await client.send("Hello");
  assert.equal(r.replayed, true);
  assert.deepEqual(sent.map((s) => s.body.request_id), [ID, ID]);
  assert.deepEqual(sent[0].body, sent[1].body);
});

test("a broken stream is followed up with the same identifier until it is known", async () => {
  const { client, sent } = setup(sse(event("start", { request_id: ID, message_id: "m1" }) + event("delta", { text: "Hi " })), json(failed("in_progress", "same_id")), json(answer({ replayed: true })));
  assert.equal((await client.send("Hello")).text, "Hi there");
  assert.deepEqual(sent.map((s) => s.body.request_id), [ID, ID, ID]);
});

test("retries are few and end in an honest answer", async () => {
  const { client, sent } = setup(() => { throw new Error("offline"); });
  const r = await client.send("Hello");
  assert.deepEqual([r.error.code, r.error.retry, sent.length], ["unavailable", "same_id", 4]);
});

test("a failure that may have cost is not retried by itself", async () => {
  const { client, sent } = setup(json(failed("unavailable", "new_attempt")));
  assert.equal((await client.send("Hello")).error.retry, "new_attempt");
  assert.equal(sent.length, 1);
});

test("a new attempt happens only when asked, with a new identifier that names the old one", async () => {
  const { client, sent } = setup(json(failed("unavailable", "new_attempt")), json(answer({ request_id: "1b0d2f0e-6a0e-4a53-9a55-0a1c8a6f1a99" })));
  const first = await client.send("Hello");
  await client.newAttempt(first.request_id);
  assert.deepEqual(sent[1].body, { request_id: "1b0d2f0e-6a0e-4a53-9a55-0a1c8a6f1a99", retry_of: ID, stream: true });
});

test("stopping asks the server to cancel and does not claim it cost nothing", async () => {
  const { client, sent } = setup(json({ ok: true }, 202));
  await client.cancel(ID);
  assert.deepEqual([sent[0].url, sent[0].method], [`/api/ai/messages/${ID}/cancel`, "POST"]);
});

test("the session is asked for with the accepted notice, and an expired one is reported", async () => {
  const { client, sent } = setup(json({ session: { turns_left: 20 } }, 201), json({ error: { code: "session_expired", retryable: false, retry: "none" } }, 401));
  assert.equal((await client.start("dev-2026-11-26")).ok, true);
  assert.deepEqual(sent[0].body, { notice_version: "dev-2026-11-26" });
  assert.equal((await client.send("Hello")).error.code, "session_expired");
});

test("it keeps nothing in the browser", async () => {
  const { readFileSync } = await import("node:fs");
  assert.doesNotMatch(readFileSync("src/lib/ai/client.ts", "utf8"), /localStorage|sessionStorage|indexedDB|document\.cookie/);
});

test("a refusal said in the stream is passed on as what it is, not as a lost connection", async () => {
  for (const code of ["rate_limited", "busy", "budget_exhausted", "ai_disabled"]) {
    const { client, sent } = setup(() => sse(event("start", { request_id: ID, message_id: "m1" }) + event("error", failed(code, "same_id"))));
    assert.deepEqual([(await client.send("Hello")).error.code, sent.length], [code, 1]);
  }
});
