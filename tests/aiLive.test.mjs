import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ended, NOTICE_VERSION, outcomeOf, sessionClock, touched, trackSession } from "../src/lib/ai/live.ts";
import { createAiClient } from "../src/lib/ai/client.ts";

const answer = (more = {}) => ({ contract: "codeshaper.ai.response", version: 1, request_id: "r", message_id: "m", status: "completed", replayed: false, text: "Hi", sources: [], actions: [], components: [], error: null, session: null, ...more });
const failed = (code, retry) => answer({ status: "error", message_id: null, text: "", error: { code, retryable: retry !== "none", retry } });

test("an outcome is what the server said, with only the retry it allows", () => {
  assert.deepEqual(outcomeOf(answer()), { state: "done" });
  assert.deepEqual(outcomeOf(answer({ status: "refused" })), { state: "done" });
  assert.deepEqual(outcomeOf(failed("cancelled", "new_attempt")), { state: "cancelled", retry: "new_attempt" });
  assert.deepEqual(outcomeOf(failed("unavailable", "same_id")), { state: "problem", problem: "unavailable", retry: "same_id" });
  assert.deepEqual(outcomeOf(failed("duplicate", "new_attempt")), { state: "problem", problem: "duplicate", retry: "new_attempt" });
  assert.deepEqual(outcomeOf(failed("budget_exhausted", "none")), { state: "problem", problem: "budget_exhausted", retry: "none" });
});

const SERVER = Date.parse("2026-11-26T10:00:00Z");
const info = { expires_at: "2026-11-27T10:00:00Z", idle_expires_at: "2026-11-26T10:30:00Z", turns_left: 20, max_chars: 1500 };

test("the session clock warns two minutes before the idle end, and says when it passed", () => {
  const clock = trackSession(info, SERVER, SERVER);
  const at = (minutes) => sessionClock(clock, SERVER + minutes * 60_000).state;
  assert.deepEqual([at(0), at(27.9), at(28), at(29.9), at(30)], ["ok", "ok", "idle_warning", "idle_warning", "expired"]);
  assert.equal(sessionClock(clock, SERVER + 29 * 60_000).msLeft, 60_000);
});

test("a visitor's wrong computer clock changes nothing: only the server's times count", () => {
  for (const skew of [-3 * 3_600_000, 90 * 60_000]) {
    const clock = trackSession(info, SERVER + skew, SERVER);
    assert.equal(sessionClock(clock, SERVER + skew + 27 * 60_000).state, "ok");
    assert.equal(sessionClock(clock, SERVER + skew + 30 * 60_000).state, "expired");
  }
});

test("activity gives a full idle period again, but never past the longest life", () => {
  // read back with five minutes left, then a message is answered
  const clock = trackSession(info, SERVER, SERVER + 25 * 60_000);
  assert.equal(sessionClock(clock, SERVER + 2 * 60_000).state, "ok");
  assert.equal(sessionClock(clock, SERVER + 6 * 60_000).state, "expired");
  assert.equal(sessionClock(touched(clock, SERVER + 4 * 60_000), SERVER + 25 * 60_000).state, "ok");
  const end = clock.expiresAt;
  assert.equal(sessionClock(touched(clock, end - 90_000), end - 60_000).state, "lifetime_warning");
  assert.equal(sessionClock(touched(clock, end - 90_000), end).state, "expired");
});

test("an unreadable time never means a session that cannot expire", () => {
  assert.equal(sessionClock(trackSession({ ...info, expires_at: "soon" }, SERVER, SERVER), SERVER).state, "expired");
});

test("the notice version is the CMS's", () => {
  assert.equal(NOTICE_VERSION, "dev-2026-11-26");
});

test("the client renews the session, and names a new attempt before sending it", async () => {
  const sent = [];
  const client = createAiClient({
    fetch: async (url, init = {}) => (sent.push([url, init.method, init.body && JSON.parse(init.body)]), new Response(JSON.stringify(url.endsWith("renew") ? { session: info } : answer({ request_id: "n" })), { status: 200, headers: { "content-type": "application/json" } })),
    uuid: () => "generated",
    wait: async () => {},
  });
  assert.deepEqual(await client.renew(), { ok: true, session: info, error: null, serverNow: null });
  assert.deepEqual(sent[0], ["/api/ai/session/renew", "POST", {}]);
  await client.newAttempt("old", () => {}, undefined, "chosen");
  assert.deepEqual(sent[1][2], { request_id: "chosen", retry_of: "old", stream: true });
});

test("the connected conversation sends only text with contact details taken out", () => {
  const hook = readFileSync("src/components/ai-prototype/useLiveConsultation.ts", "utf8");
  assert.match(hook, /separateContact/);
  assert.doesNotMatch(hook, /\.send\(\s*text\b|\.send\(\s*shown\b/);
});

test("ending an ended session changes nothing, so the screen does not ask the server for ever", () => {
  const clock = trackSession(info, SERVER, SERVER);
  const over = ended(clock, SERVER + 1000);
  assert.equal(sessionClock(over, SERVER + 1000).state, "expired");
  assert.equal(ended(over, SERVER + 5000), over);
});
