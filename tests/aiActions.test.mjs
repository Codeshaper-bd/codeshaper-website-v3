import { test } from "node:test";
import assert from "node:assert/strict";
import { bookingReducer, contactErrors, demoDays, inquiryReducer, newBooking, newInquiry, separateContact } from "../src/lib/ai/actions.ts";

const play = (reducer, from, events) => events.reduce((m, e) => reducer(m, typeof e === "string" ? { type: e } : e), from);
const fill = (field, value) => ({ type: "CHANGE", field, value });
const FILLED = [fill("name", "Synthetic Person"), fill("email", "person@example.test")];

test("an inquiry goes draft, reviewing, submitting, submitted, and only that way", () => {
  const review = play(inquiryReducer, newInquiry(), [...FILLED, "REVIEW"]);
  assert.equal(review.state, "reviewing");
  const sending = play(inquiryReducer, review, ["CONFIRM"]);
  assert.equal(sending.state, "submitting");
  assert.equal(play(inquiryReducer, sending, [{ type: "RESULT", ok: true }]).state, "submitted");
});

test("nothing is submitted without a review and the visitor's confirmation", () => {
  const filled = play(inquiryReducer, newInquiry(), FILLED);
  for (const e of ["CONFIRM", { type: "RESULT", ok: true }]) assert.equal(play(inquiryReducer, filled, [e]), filled);
  const review = play(inquiryReducer, filled, ["REVIEW"]);
  assert.equal(play(inquiryReducer, review, [{ type: "RESULT", ok: true }]), review, "success is never claimed before sending");
});

test("a second confirmation changes nothing, and one submission keeps one identifier", () => {
  const sending = play(inquiryReducer, newInquiry("id-1"), [...FILLED, "REVIEW", "CONFIRM"]);
  assert.equal(play(inquiryReducer, sending, ["CONFIRM", "CONFIRM", fill("email", "other@example.test")]), sending);
  const failed = play(inquiryReducer, sending, [{ type: "RESULT", ok: false }]);
  assert.equal(failed.state, "failed");
  const again = play(inquiryReducer, failed, ["CONFIRM"]);
  assert.deepEqual([again.state, again.id], ["submitting", "id-1"]);
  const done = play(inquiryReducer, again, [{ type: "RESULT", ok: true }]);
  assert.equal(play(inquiryReducer, done, ["CONFIRM", "EDIT", "REVIEW"]), done, "a sent inquiry is not sent again");
});

test("invalid contact details cannot be reviewed", () => {
  for (const [name, email, phone] of [["", "a@b.co", ""], ["A", "not-an-email", ""], ["A", "a@b", ""], ["A", "a@b.co", "call me"], ["x".repeat(121), "a@b.co", ""]]) {
    const m = play(inquiryReducer, newInquiry(), [fill("name", name), fill("email", email), fill("phone", phone), "REVIEW"]);
    assert.equal(m.state, "draft", `${name} ${email} ${phone}`);
    assert.ok(Object.keys(contactErrors(m.contact)).length);
  }
  assert.deepEqual(contactErrors({ name: "A", email: "a@b.co", phone: "+880 1700-000000", message: "" }), {});
});

test("changing anything after review sends it back to draft", () => {
  const review = play(inquiryReducer, newInquiry(), [...FILLED, "REVIEW"]);
  assert.equal(play(inquiryReducer, review, ["EDIT"]).state, "draft");
  assert.equal(play(inquiryReducer, review, [fill("email", "changed@example.test")]).state, "draft");
});

const NOW = Date.parse("2026-11-26T09:00:00Z"); // a Thursday
const days = demoDays(NOW);
const slot = days[0].slots[0];

test("demonstration availability is in the future, on weekdays, and the same each time", () => {
  assert.deepEqual(demoDays(NOW), days);
  assert.equal(days.length, 4);
  for (const d of days) for (const s of d.slots) {
    assert.ok(Date.parse(s) > NOW);
    assert.ok(![0, 6].includes(new Date(s).getUTCDay()));
  }
});

test("a booking is picked, detailed, reviewed, confirmed", () => {
  const picked = play(bookingReducer, newBooking("b1"), [{ type: "PICK", slot }]);
  assert.equal(picked.state, "details");
  const review = play(bookingReducer, picked, [...FILLED, "REVIEW"]);
  assert.equal(review.state, "reviewing");
  const done = play(bookingReducer, review, ["CONFIRM", { type: "RESULT", outcome: "ok" }]);
  assert.deepEqual([done.state, done.slot], ["confirmed", slot]);
});

test("a taken slot sends the visitor back to choose another, keeping their details", () => {
  const sending = play(bookingReducer, newBooking("b1"), [{ type: "PICK", slot }, ...FILLED, "REVIEW", "CONFIRM"]);
  const taken = play(bookingReducer, sending, [{ type: "RESULT", outcome: "slot_taken" }]);
  assert.deepEqual([taken.state, taken.slot, taken.taken, taken.contact.email], ["picking", null, [slot], "person@example.test"]);
  assert.equal(play(bookingReducer, taken, [{ type: "PICK", slot }]), taken, "a taken slot cannot be picked again");
});

test("booking cannot skip review, repeat, or claim success early", () => {
  const picked = play(bookingReducer, newBooking(), [{ type: "PICK", slot }, ...FILLED]);
  for (const e of ["CONFIRM", { type: "RESULT", outcome: "ok" }]) assert.equal(play(bookingReducer, picked, [e]), picked);
  const sending = play(bookingReducer, picked, ["REVIEW", "CONFIRM"]);
  assert.equal(play(bookingReducer, sending, ["CONFIRM", "CHANGE_TIME", { type: "PICK", slot: days[1].slots[0] }]), sending);
  const failed = play(bookingReducer, sending, [{ type: "RESULT", outcome: "failed" }]);
  assert.equal(failed.state, "failed");
  assert.equal(play(bookingReducer, failed, ["CONFIRM"]).state, "submitting");
  assert.equal(play(bookingReducer, failed, ["CHANGE_TIME"]).state, "picking");
});

test("contact details are taken out of a message before it reaches the assistant", () => {
  const r = separateContact("My name is Synthetic Person, mail me at person@example.test or +880 1711-000000. We need an app.");
  assert.deepEqual(r.contact, { name: "Synthetic Person", email: "person@example.test", phone: "+880 1711-000000" });
  assert.doesNotMatch(r.forAssistant, /person@example|1711|Synthetic Person/);
  assert.match(r.forAssistant, /We need an app/);
  assert.doesNotMatch(r.shown, /person@example\.test|1711-000000/);
  assert.deepEqual(separateContact("We need it in 3 months for 200 users"), { forAssistant: "We need it in 3 months for 200 users", shown: "We need it in 3 months for 200 users", contact: {} });
});

test("a new conversation starts both afresh, with a new identifier, but never while sending", () => {
  const sent = play(inquiryReducer, newInquiry("a"), [...FILLED, "REVIEW", "CONFIRM", { type: "RESULT", ok: true }]);
  assert.deepEqual(inquiryReducer(sent, { type: "RESET", id: "b" }), newInquiry("b"));
  const booked = play(bookingReducer, newBooking("a"), [{ type: "PICK", slot }, ...FILLED, "REVIEW", "CONFIRM", { type: "RESULT", outcome: "ok" }]);
  assert.deepEqual(bookingReducer(booked, { type: "RESET", id: "b" }), newBooking("b"));
  const sending = play(inquiryReducer, newInquiry("a"), [...FILLED, "REVIEW", "CONFIRM"]);
  assert.equal(inquiryReducer(sending, { type: "RESET", id: "b" }), sending, "a submission on its way keeps its record");
});
