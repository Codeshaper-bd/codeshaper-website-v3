import { test } from "node:test";
import assert from "node:assert/strict";
import { parseConfirmation, parseProposals } from "../src/lib/ai/proposals.ts";

const booking = { type: "booking_calendar", demo: true, duration_minutes: 30, days: [{ date: "2026-11-27", slots: ["2026-11-27T04:00:00Z"] }] };
const good = [
  { type: "contact_capture", include_brief: true },
  booking,
  { type: "brief_changes", changes: [{ field: "platforms", before: "Web first", after: "Web first, mobile application" }] },
  { type: "recoverable_error", code: "slot_unavailable" },
];

test("each proposed component passes", () => {
  for (const c of good) assert.deepEqual(parseProposals([c]), [c], c.type);
});

test("forged or unsafe payloads are dropped", () => {
  const bad = [
    null, "x", [], { type: "html", html: "<img onerror=1>" },
    { ...good[0], email: "a@b.co" }, { type: "contact_capture", include_brief: "yes" }, { type: "contact_capture", include_brief: true, submit: true },
    { ...booking, demo: false }, { ...booking, url: "https://evil.test" }, { ...booking, days: [] },
    { ...booking, days: [{ date: "tomorrow", slots: ["2026-11-27T04:00:00Z"] }] }, { ...booking, days: [{ date: "2026-11-27", slots: ["javascript:alert(1)"] }] },
    { ...booking, days: [{ date: "2026-11-27", slots: Array(13).fill("2026-11-27T04:00:00Z") }] }, { ...booking, days: Array(8).fill(booking.days[0]) }, { ...booking, duration_minutes: 100000 },
    { type: "brief_changes", changes: [] }, { type: "brief_changes", changes: [{ field: "price", before: "", after: "1" }] }, { type: "brief_changes", changes: [{ field: "goal", before: "", after: "x".repeat(700) }] },
    { type: "recoverable_error", code: "<b>" },
    // an assistant can never announce that something was done
    { type: "action_confirmation", action: "booking", status: "confirmed", reference: "x", simulated: false },
    { type: "inquiry_review", name: "A", email: "a@b.co" }, { type: "booking_review" },
  ];
  for (const c of bad) assert.deepEqual(parseProposals([c]), [], JSON.stringify(c)?.slice(0, 80));
  assert.deepEqual(parseProposals("nope"), []);
});

test("at most three, and the good ones survive bad neighbours", () => {
  assert.equal(parseProposals([...good, ...good]).length, 3);
  assert.deepEqual(parseProposals([{ type: "html" }, good[0]]), [good[0]]);
});

test("a confirmation counts only from an action's own result, and says if it was simulated", () => {
  const ok = { action: "inquiry", status: "submitted", reference: "SIM-1", simulated: true };
  assert.deepEqual(parseConfirmation(ok), ok);
  for (const bad of [{ ...ok, status: "done" }, { ...ok, action: "payment" }, { ...ok, simulated: undefined }, { ...ok, extra: 1 }, { ...ok, reference: "" }]) assert.equal(parseConfirmation(bad), null);
});
