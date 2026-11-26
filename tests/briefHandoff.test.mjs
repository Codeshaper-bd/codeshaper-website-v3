import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { BRIEF_KEY, BRIEF_MAX, continueResponse, saveBrief, takeBrief } from "../src/lib/briefHandoff.ts";

const memory = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), size: () => m.size };
};
const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } };

test("the text is handed over once and then forgotten", () => {
  const store = memory();
  assert.equal(saveBrief("We need a clinic booking app", store), true);
  assert.equal(takeBrief(store), "We need a clinic booking app");
  assert.equal(takeBrief(store), "");
  assert.equal(store.size(), 0);
});

test("it is cut to the box's limit", () => {
  const store = memory();
  saveBrief("x".repeat(BRIEF_MAX + 50), store);
  assert.equal(takeBrief(store).length, BRIEF_MAX);
});

test("blocked browser storage is reported, not thrown", () => {
  assert.equal(saveBrief("hello", blocked), false);
  assert.equal(takeBrief(blocked), "");
});

const post = (brief, headers = {}) => new Request("https://codeshaper.test/contact/continue", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", ...headers }, body: new URLSearchParams({ brief }) });
const contact = { email: "info@example.test", phone: "+000 111" };
const HOSTILE = '</textarea><script>alert(1)</script>" onmouseover="x';

test("without JavaScript the visitor sees their own words, safely, and that nothing was sent", async () => {
  const res = await continueResponse(post(HOSTILE), contact);
  const html = await res.text();
  assert.equal(res.status, 200);
  assert.ok(html.includes("&lt;/textarea&gt;&lt;script&gt;alert(1)&lt;/script&gt;&quot; onmouseover=&quot;x"));
  assert.ok(!html.includes("<script>alert"));
  assert.match(html, /Nothing has been sent yet/);
  assert.ok(html.includes("mailto:info@example.test"));
});

test("the answer is never stored, indexed or passed on as a referrer", async () => {
  const res = await continueResponse(post("private words"), contact);
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.match(res.headers.get("x-robots-tag"), /noindex/);
  assert.equal(res.headers.get("referrer-policy"), "no-referrer");
  assert.equal(res.headers.get("location"), null);
  assert.equal(res.headers.get("set-cookie"), null);
  // no site-wide headers reach this page, so it carries the basic ones itself
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("x-frame-options"), "DENY");
});

test("its one script is fixed, and the page's policy allows nothing else", async () => {
  const scripts = [];
  for (const words of ["one", HOSTILE]) {
    const res = await continueResponse(post(words), contact);
    const found = [...(await res.text()).matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    assert.equal(found.length, 1);
    scripts.push(found[0]);
    const hash = createHash("sha256").update(found[0]).digest("base64");
    assert.ok(res.headers.get("content-security-policy").includes(`script-src 'sha256-${hash}'`));
    assert.match(res.headers.get("content-security-policy"), /default-src 'none'/);
  }
  assert.equal(scripts[0], scripts[1]);
});

test("another website cannot put its own words in front of our visitor", async () => {
  const res = await continueResponse(post("attacker words", { "sec-fetch-site": "cross-site" }), contact);
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), "/contact");
});

test("an oversized or unreadable request goes to the plain contact page", async () => {
  const huge = await continueResponse(post("x".repeat(40_000), { "content-length": "40006" }), contact);
  assert.deepEqual([huge.status, huge.headers.get("location")], [303, "/contact"]);
  const bad = await continueResponse(new Request("https://codeshaper.test/contact/continue", { method: "POST", headers: { "content-type": "multipart/form-data" }, body: "junk" }), contact);
  assert.deepEqual([bad.status, bad.headers.get("location")], [303, "/contact"]);
});

const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(dir, e.name)] : []));

test("nothing in the site builds an address with a brief in it", () => {
  const offenders = files("src").filter((f) => /[?&]brief=|\.get\(["']brief["']\)(?!.*form)/.test(readFileSync(f, "utf8").replace(/form\.get\("brief"\)/g, "")));
  assert.deepEqual(offenders, []);
});

test("every form that holds a visitor's words is sent by POST, even before the page's script is ready", () => {
  for (const f of ["src/components/hero/HeroAsk.tsx", "src/components/sections/ContactForm.tsx", "src/components/sections/BookingForm.tsx"]) {
    const forms = readFileSync(f, "utf8").match(/<form\b[\s\S]*?>\s*\n/g) ?? [];
    assert.ok(forms.length > 0, f);
    for (const form of forms) assert.match(form, /method="post"/, f);
  }
});

test("the hero no longer says that it sends anything", () => {
  const hero = readFileSync("src/components/hero/HeroAsk.tsx", "utf8");
  assert.doesNotMatch(hero, /Send to our team|goes straight to our team/);
});

test("the storage key is stable", () => assert.equal(BRIEF_KEY, "cs-brief"));
