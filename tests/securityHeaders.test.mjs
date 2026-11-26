import { test } from "node:test";
import assert from "node:assert/strict";
import { securityHeaderRules } from "../src/lib/securityHeaders.mjs";

const byKey = (rule) => Object.fromEntries(rule.headers.map((h) => [h.key, h.value]));
const directives = (csp) => Object.fromEntries(csp.split(";").map((d) => d.trim().split(/\s+/)).filter((d) => d[0]).map(([name, ...v]) => [name, v]));
const rules = (env) => {
  const [site, preview] = securityHeaderRules(env);
  return { site: byKey(site), preview: byKey(preview), sources: [site.source, preview.source] };
};
const production = { NODE_ENV: "production" };

test("every page gets the basic protections", () => {
  const { site } = rules(production);
  assert.equal(site["X-Content-Type-Options"], "nosniff");
  assert.equal(site["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(site["X-Frame-Options"], "SAMEORIGIN");
  assert.match(site["Permissions-Policy"], /camera=\(\).*microphone=\(\).*geolocation=\(\)/);
  assert.match(site["Strict-Transport-Security"], /max-age=31536000/);
});

test("what is enforced now: no foreign framing, plugins, base tag or form target", () => {
  const csp = directives(rules(production).site["Content-Security-Policy"]);
  assert.deepEqual(csp, { "base-uri": ["'self'"], "object-src": ["'none'"], "form-action": ["'self'"], "frame-ancestors": ["'self'"] });
});

test("the strict policy is only reporting, and has no broad exception", () => {
  const report = directives(rules(production).site["Content-Security-Policy-Report-Only"]);
  for (const [name, values] of Object.entries(report)) {
    for (const v of values) {
      assert.ok(!["*", "https:", "http:", "'unsafe-eval'"].includes(v), `${name} ${v}`);
      if (v === "'unsafe-inline'") assert.equal(name, "style-src-attr");
    }
  }
  assert.deepEqual(report["default-src"], ["'self'"]);
  assert.ok(!("frame-ancestors" in report), "browsers ignore it in a report-only policy");
});

test("the integrations the site uses are allowed", () => {
  const report = directives(rules(production).site["Content-Security-Policy-Report-Only"]);
  assert.ok(report["script-src"].includes("https://app.cal.com") && report["frame-src"].includes("https://app.cal.com"));
  for (const host of ["https://www.googletagmanager.com", "https://connect.facebook.net", "https://snap.licdn.com", "https://www.clarity.ms"]) assert.ok(report["script-src"].includes(host), host);
  for (const host of ["https://www.youtube-nocookie.com", "https://player.vimeo.com", "https://www.google.com", "https://maps.google.com", "https://www.figma.com", "https://www.loom.com", "https://codepen.io"]) assert.ok(report["frame-src"].includes(host), host);
});

test("only the CMS preview may be framed by the CMS, when the CMS is on another address", () => {
  const { site, preview, sources } = rules({ ...production, CMS_PUBLIC_ORIGIN: "https://admin.example.test/ignored/path" });
  assert.deepEqual(directives(preview["Content-Security-Policy"])["frame-ancestors"], ["'self'", "https://admin.example.test"]);
  assert.deepEqual(directives(site["Content-Security-Policy"])["frame-ancestors"], ["'self'"]);
  assert.equal(preview["X-Frame-Options"], undefined);
  assert.deepEqual(sources, ["/((?!preview/|contact/continue|newsletter/subscribe).*)", "/preview/:path*"]);
});

test("on a developer's computer the local CMS can frame the preview, and HTTPS is not forced", () => {
  const { preview, site } = rules({ NODE_ENV: "development" });
  assert.ok(directives(preview["Content-Security-Policy"])["frame-ancestors"].includes("http://localhost:8090"));
  assert.equal(site["Strict-Transport-Security"], undefined);
});

test("a bad CMS address adds nothing to the policy", () => {
  const { preview } = rules({ ...production, CMS_PUBLIC_ORIGIN: "javascript:alert(1); script-src *" });
  assert.deepEqual(directives(preview["Content-Security-Policy"])["frame-ancestors"], ["'self'"]);
});

test("the no-script enquiry page is left to its own stricter headers, which these would overwrite", () => {
  const applies = (path) => securityHeaderRules(production).filter((r) => new RegExp(`^${r.source.replace("/:path*", "(/.*)?")}$`).test(path)).length;
  assert.equal(applies("/contact/continue"), 0);
  assert.equal(applies("/newsletter/subscribe"), 0);
  for (const path of ["/", "/contact", "/api/contact", "/blog/x", "/preview/pages/1"]) assert.equal(applies(path), 1, path);
});

test("in production the approved admin address may frame previews without extra setup", () => {
  const { preview, site } = rules(production);
  assert.deepEqual(directives(preview["Content-Security-Policy"])["frame-ancestors"], ["'self'", "https://admin.codeshaper.net"]);
  assert.deepEqual(directives(site["Content-Security-Policy"])["frame-ancestors"], ["'self'"]);
});

test("a draft preview may show the CMS's pictures and videos; public pages may not", () => {
  const { preview, site } = rules(production);
  const reportOnly = (rule) => directives(rule["Content-Security-Policy-Report-Only"]);
  for (const name of ["img-src", "media-src"]) {
    assert.ok(reportOnly(preview)[name].includes("https://admin.codeshaper.net"), name);
    assert.ok(!reportOnly(site)[name].includes("https://admin.codeshaper.net"), name);
  }
  assert.ok(!reportOnly(preview)["script-src"].includes("https://admin.codeshaper.net"));
});
