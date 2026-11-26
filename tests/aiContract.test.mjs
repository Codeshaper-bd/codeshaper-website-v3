import { test } from "node:test";
import assert from "node:assert/strict";
import { BRIEF_ORDER, briefToText, emptyBrief, hasBrief, parseResponse } from "../src/lib/ai/contract.ts";

const base = { contract: "codeshaper.ai.response", version: 1, request_id: "r1", message_id: "m1", status: "completed", text: "Hello", sources: [], actions: [], components: [], error: null };

test("a well formed answer passes", () => {
  assert.deepEqual(parseResponse(base), base);
});

test("anything that is not this contract is refused whole", () => {
  for (const bad of [null, "text", 5, [], {}, { ...base, contract: "other" }, { ...base, version: 2 }, { ...base, status: "done" }, { ...base, text: 4 }, { ...base, request_id: "" }, { ...base, sources: "x" }, { ...base, text: "x".repeat(16001) }]) assert.equal(parseResponse(bad), null, JSON.stringify(bad)?.slice(0, 80));
});

test("sources may only be pages of this website", () => {
  const sources = [{ title: "Work", path: "/case-studies" }, { title: "Out", path: "//evil.test" }, { title: "Out", path: "https://evil.test" }, { title: "Script", path: "javascript:alert(1)" }, { title: "Slash", path: "/\\evil.test" }, { title: "Query", path: "/contact?brief=words" }];
  assert.deepEqual(parseResponse({ ...base, sources }).sources, [sources[0]]);
});

test("only known actions are kept, and at most four", () => {
  const ok = { type: "suggest_reply", label: "Web only" };
  const actions = [ok, { type: "run_command", label: "x" }, { type: "book_consultation" }, { type: "open_contact", label: "x".repeat(81) }, { ...ok, url: "https://evil.test" }, ok, ok, ok, ok];
  const kept = parseResponse({ ...base, actions }).actions;
  assert.equal(kept.length, 4);
  assert.ok(kept.every((a) => Object.keys(a).join() === "type,label"));
});

test("unknown or unsafe components are dropped, the words stay", () => {
  const components = [
    { type: "html", html: "<img src=x onerror=alert(1)>" },
    { type: "services", slugs: ["../admin"] },
    { type: "services", slugs: [] },
    { type: "services", slugs: ["a", "b", "c", "d"] },
    { type: "services", slugs: ["ai-software-development"], title: "Injected" },
    { type: "technologies", items: [{ name: "x", reason: "y", href: "z" }] },
    { type: "project_brief", fields: { goal: "g", price: "1" } },
    { type: "project_brief", fields: { features: "not a list" } },
    { type: "consultation", onClick: "x" },
    { type: "case_studies", slugs: ["essentialist"] },
  ];
  const r = parseResponse({ ...base, components });
  assert.equal(r.text, "Hello");
  assert.deepEqual(r.components, [{ type: "case_studies", slugs: ["essentialist"] }]);
});

test("every allowed component passes, at most three", () => {
  const components = [{ type: "technologies", items: [{ name: "Laravel", reason: "Already in use" }] }, { type: "project_brief", fields: { goal: "g", features: ["a"] } }, { type: "contact_preview" }, { type: "consultation" }];
  assert.deepEqual(parseResponse({ ...base, components }).components, components.slice(0, 3));
});

test("an error answer carries a known code only", () => {
  const error = { code: "budget_exhausted", retryable: false };
  assert.deepEqual(parseResponse({ ...base, status: "error", message_id: null, text: "", error }).error, error);
  assert.equal(parseResponse({ ...base, status: "error", text: "", error: { code: "stack trace", retryable: true } }), null);
  assert.equal(parseResponse({ ...base, status: "error", text: "", error: null }), null);
});

test("a brief with nothing in it is empty, and unknown stays unknown in its text", () => {
  assert.equal(hasBrief(emptyBrief()), false);
  const brief = { ...emptyBrief(), goal: "A clinic booking app", features: ["Booking", "Reminders"] };
  assert.equal(hasBrief(brief), true);
  assert.equal(briefToText(brief), "Goal: A clinic booking app\nKey features: Booking, Reminders");
  assert.equal(BRIEF_ORDER.length, 8);
});

test("the contact form text never passes its limit", () => {
  assert.ok(briefToText({ ...emptyBrief(), goal: "x".repeat(3000) }).length <= 1000);
});
