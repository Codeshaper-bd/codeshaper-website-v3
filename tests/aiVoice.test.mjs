import { test } from "node:test";
import assert from "node:assert/strict";
import { initialVoice, VOICE_STATES, voiceReducer } from "../src/lib/ai/voiceMachine.ts";

const play = (events, from = initialVoice) => events.reduce((m, e) => voiceReducer(m, typeof e === "string" ? { type: e } : e), from);
const heard = { type: "TRANSCRIBED", text: "A booking app" };

test("a full turn, with permission asked once", () => {
  assert.equal(play(["START"]).state, "permission");
  assert.equal(play(["START", "ALLOW"]).state, "listening");
  assert.equal(play(["START", "ALLOW", "STOP"]).state, "stopped");
  assert.equal(play(["START", "ALLOW", "STOP", "TRANSCRIBE"]).state, "transcribing");
  const review = play(["START", "ALLOW", "STOP", "TRANSCRIBE", heard]);
  assert.deepEqual([review.state, review.transcript], ["review", "A booking app"]);
  const done = play(["CONFIRM", "REPLY", "DONE"], review);
  assert.equal(done.state, "ready");
  assert.equal(play(["START"], done).state, "listening");
});

test("nothing is sent without the visitor confirming a transcript with words in it", () => {
  const review = play(["START", "ALLOW", "STOP", "TRANSCRIBE", heard]);
  assert.equal(play([{ type: "EDIT", text: "Changed" }], review).transcript, "Changed");
  assert.equal(play([{ type: "EDIT", text: "  " }, "CONFIRM"], review).state, "review");
  assert.deepEqual([play(["DISCARD"], review).state, play(["DISCARD"], review).transcript], ["ready", ""]);
  for (const s of ["START", "STOP", "REPLY", "DONE"]) assert.equal(play([s], review).state, "review");
});

test("refusal and failure lead to an error that can be left", () => {
  const denied = play(["START", "DENY"]);
  assert.deepEqual([denied.state, denied.error], ["error", "mic_denied"]);
  assert.equal(play(["RETRY", "START"], denied).state, "permission");
  const failed = play(["START", "ALLOW", "STOP", "TRANSCRIBE", "TRANSCRIPTION_FAILED"]);
  assert.deepEqual([failed.state, failed.error], ["error", "transcription"]);
  assert.equal(play(["START", "ALLOW", "STOP", "TRANSCRIBE", heard, "CONFIRM", "FAIL"]).error, "reply");
});

test("playback can be muted, unmuted and stopped", () => {
  const speaking = play(["START", "ALLOW", "STOP", "TRANSCRIBE", heard, "CONFIRM", "REPLY"]);
  assert.equal(play(["MUTE"], speaking).state, "muted");
  assert.equal(play(["MUTE", "UNMUTE"], speaking).state, "speaking");
  assert.equal(play(["STOP_PLAYBACK"], speaking).state, "ready");
  assert.equal(play(["MUTE", "DONE"], speaking).state, "ready");
});

test("voice can be ended from anywhere and started again", () => {
  for (const events of [[], ["START"], ["START", "ALLOW"], ["START", "ALLOW", "STOP", "TRANSCRIBE", heard]]) {
    const ended = play([...events, "END"]);
    assert.equal(ended.state, "ended");
    assert.equal(play(["START"], ended).state, "ended");
    assert.equal(play(["RESTART"], ended).state, "ready");
  }
});

test("repeated or out of place events change nothing", () => {
  const listening = play(["START", "ALLOW"]);
  assert.equal(play(["START", "ALLOW", "CONFIRM", "REPLY"], listening), listening);
  assert.equal(VOICE_STATES.length, 11);
});
