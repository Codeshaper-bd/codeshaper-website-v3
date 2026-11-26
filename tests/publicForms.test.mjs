import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { refuseJsonPost } from "../src/lib/requestGuard.ts";
import { newsletterFormResponse } from "../src/lib/briefHandoff.ts";

// ── the JSON routes ────────────────────────────────────────────────────────
const json = (headers) => new Request("https://codeshaper.test/api/contact", { method: "POST", headers, body: "{}" });

test("our own pages may send JSON", () => {
  assert.equal(refuseJsonPost(json({ "content-type": "application/json", "sec-fetch-site": "same-origin" })), null);
  assert.equal(refuseJsonPost(json({ "content-type": "application/json; charset=utf-8" })), null);
});

test("another site cannot send a lead from a visitor's browser", () => {
  // what a plain HTML form on a hostile page can send without any permission
  for (const type of ["text/plain", "application/x-www-form-urlencoded", "multipart/form-data; boundary=x", ""]) {
    assert.equal(refuseJsonPost(json(type ? { "content-type": type } : {}))?.status, 415, type);
  }
  assert.equal(refuseJsonPost(json({ "content-type": "application/json", "sec-fetch-site": "cross-site" }))?.status, 403);
  // a sibling address (the admin) has no business posting here either
  assert.equal(refuseJsonPost(json({ "content-type": "application/json", "sec-fetch-site": "same-site" }))?.status, 403);
});

for (const route of ["contact", "newsletter"]) {
  test(`the ${route} route uses that guard before anything else`, () => {
    const source = readFileSync(`src/app/api/${route}/route.ts`, "utf8");
    assert.ok(source.indexOf("refuseJsonPost(request)") > 0 && source.indexOf("refuseJsonPost(request)") < source.indexOf("tooMany(request"));
  });
}

test("the blog numbers route takes text beacons, but not from another site", () => {
  const source = readFileSync("src/app/api/blog/stats/route.ts", "utf8");
  assert.ok(source.includes("if (fromAnotherSite(request.headers))"));
});

// ── the newsletter without the page's script ───────────────────────────────
const post = (fields, headers = {}) => new Request("https://codeshaper.test/newsletter/subscribe", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", ...headers }, body: new URLSearchParams(fields) });

function run(fields, { headers, limited = false, result = "ok" } = {}) {
  const sent = [];
  return newsletterFormResponse(post(fields, headers), { limited: () => limited, subscribe: async (email) => (sent.push(email), result) }).then(async (res) => ({ res, sent, body: await res.text() }));
}

test("a plain form signup really subscribes, and says so", async () => {
  const { res, sent, body } = await run({ email: " reader@example.test " });
  assert.equal(res.status, 200);
  assert.deepEqual(sent, ["reader@example.test"]);
  assert.match(body, /You(’|'|&#39;)re subscribed/);
});

test("the answer never carries the address, runs no script and is not stored or referred", async () => {
  const { res, body } = await run({ email: "reader@example.test" });
  assert.ok(!body.includes("reader@example.test"));
  assert.ok(!body.includes("<script"));
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.equal(res.headers.get("referrer-policy"), "no-referrer");
  assert.equal(res.headers.get("location"), null);
  assert.equal(res.headers.get("set-cookie"), null);
  assert.match(res.headers.get("content-security-policy"), /default-src 'none'/);
  assert.match(res.headers.get("x-robots-tag"), /noindex/);
});

test("bad addresses, floods and failures are told apart, and nothing false is claimed", async () => {
  const bad = await run({ email: "nope" });
  assert.deepEqual([bad.res.status, bad.sent.length], [400, 0]);
  const many = await run({ email: "a@example.test" }, { limited: true });
  assert.deepEqual([many.res.status, many.sent.length], [429, 0]);
  const failed = await run({ email: "a@example.test" }, { result: "failed" });
  assert.equal(failed.res.status, 503);
  const refused = await run({ email: "a@example.test" }, { result: "invalid" });
  assert.equal(refused.res.status, 400);
  for (const r of [bad, many, failed, refused]) assert.doesNotMatch(r.body, /subscribed\./);
});

test("a bot that fills the hidden box is answered and ignored", async () => {
  const { res, sent } = await run({ email: "a@example.test", company_website: "x" });
  assert.deepEqual([res.status, sent.length], [200, 0]);
});

test("another site cannot subscribe someone through a visitor's browser", async () => {
  for (const site of ["cross-site", "same-site"]) {
    const { res, sent } = await run({ email: "a@example.test" }, { headers: { "sec-fetch-site": site } });
    assert.deepEqual([res.status, res.headers.get("location"), sent.length], [303, "/", 0], site);
  }
});

// ── every public form ──────────────────────────────────────────────────────
const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : /\.tsx$/.test(e.name) ? [path.join(dir, e.name)] : []));
const forms = files("src").flatMap((f) => (readFileSync(f, "utf8").match(/<form\b(?:[^>{}"]|"[^"]*"|\{(?:[^{}]|\{[^{}]*\})*\})*>/g) ?? []).map((tag) => ({ f, tag })));

test("the scan finds every form (update the number when one is added, and give it a safe action)", () => {
  assert.equal(forms.length, 7, forms.map((x) => x.f).join(", "));
});

test("every form posts to a plain-form address, so nothing typed can reach a web address", () => {
  const allowed = ["/contact/continue", "/newsletter/subscribe"];
  for (const { f, tag } of forms) {
    assert.match(tag, /\smethod="post"/, f);
    assert.ok(allowed.some((a) => tag.includes(`action="${a}"`)), `${f}: ${tag.slice(0, 120)}`);
  }
});

test("a custom dropdown does not block the plain form before its script runs", () => {
  // without the script nobody can choose a value, so a server-rendered `required` silently stops the form
  const source = readFileSync("src/components/system/ListSelect.tsx", "utf8");
  assert.ok(source.includes("required={required && ready}"));
  assert.match(source, /useEffect\(\(\) => setReady\(true\), \[\]\)/);
});
