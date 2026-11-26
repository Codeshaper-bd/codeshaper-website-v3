import { test } from "node:test";
import assert from "node:assert/strict";
import { createLimiter, POLICIES } from "../src/lib/rateLimit.ts";

const from = (ip, header = "x-real-ip") => new Headers(ip ? { [header]: ip } : {});
const times = (n, f) => Array.from({ length: n }, f);

test("one visitor is limited, another is not", () => {
  const limit = createLimiter();
  times(POLICIES.contact.perVisitor, () => assert.equal(limit(from("198.51.100.1"), "contact"), false));
  assert.equal(limit(from("198.51.100.1"), "contact"), true);
  assert.equal(limit(from("198.51.100.2"), "contact"), false);
});

test("heavy blog traffic uses nothing of the contact or newsletter allowance", () => {
  const limit = createLimiter();
  times(10_000, (_, i) => limit(from(`198.51.${i % 200}.${i % 250}`), "blog"));
  assert.equal(limit(from("203.0.113.9"), "blog"), true);
  assert.equal(limit(from("203.0.113.9"), "contact"), false);
  assert.equal(limit(from("203.0.113.9"), "newsletter"), false);
});

test("forged address headers cannot pass the overall ceiling", () => {
  const limit = createLimiter();
  const allowed = times(POLICIES.contact.overall * 3, (_, i) => limit(from(`forged-${i}`), "contact")).filter((blocked) => !blocked).length;
  assert.equal(allowed, POLICIES.contact.overall);
});

test("without any address header there is still a limit", () => {
  const limit = createLimiter();
  const allowed = times(1000, () => limit(from(null), "contact")).filter((blocked) => !blocked).length;
  assert.equal(allowed, POLICIES.contact.overall);
});

test("the address our own proxy set wins over one the visitor added", () => {
  const limit = createLimiter();
  times(POLICIES.contact.perVisitor, (_, i) => limit(new Headers({ "x-real-ip": "198.51.100.7", "x-forwarded-for": `forged-${i}` }), "contact"));
  assert.equal(limit(new Headers({ "x-real-ip": "198.51.100.7", "x-forwarded-for": "forged-new" }), "contact"), true);
  const other = createLimiter();
  times(POLICIES.contact.perVisitor, (_, i) => other(from(`forged-${i}, 198.51.100.8`, "x-forwarded-for"), "contact"));
  assert.equal(other(from("another-forgery, 198.51.100.8", "x-forwarded-for"), "contact"), true);
});

test("a visitor who is already blocked does not use up everyone's allowance", () => {
  const limit = createLimiter();
  times(1000, () => limit(from("198.51.100.66"), "contact"));
  assert.equal(limit(from("198.51.100.67"), "contact"), false);
});

test("the allowance comes back after the window", () => {
  let now = 0;
  const limit = createLimiter(() => now);
  times(POLICIES.contact.perVisitor, () => limit(from("a"), "contact"));
  assert.equal(limit(from("a"), "contact"), true);
  now += POLICIES.contact.windowMs + 1;
  assert.equal(limit(from("a"), "contact"), false);
});

test("publishing and the future AI routes have their own policies", () => {
  assert.ok(POLICIES.publish && POLICIES.ai);
});

test("when an overall ceiling fills, it is reported once a window, naming only the kind of form", () => {
  let now = 0;
  const reported = [];
  const limit = createLimiter(() => now, (...what) => reported.push(what));
  times(POLICIES.contact.overall + 50, (_, i) => limit(from(`198.51.100.${i}`), "contact"));
  assert.deepEqual(reported, [["contact"]]);
  now += POLICIES.contact.windowMs + 1;
  times(POLICIES.contact.overall + 5, (_, i) => limit(from(`203.0.113.${i}`), "contact"));
  assert.deepEqual(reported, [["contact"], ["contact"]]);
});

test("one blocked visitor is not reported: that is the limit working", () => {
  const reported = [];
  const limit = createLimiter(Date.now, (...what) => reported.push(what));
  times(500, () => limit(from("198.51.100.1"), "contact"));
  assert.deepEqual(reported, []);
});
