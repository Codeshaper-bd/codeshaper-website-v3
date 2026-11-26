import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { serializeJsonLd } from "../src/lib/jsonLd.ts";

const HOSTILE = '</script><script>alert(1)</script><!-- & \u2028 \u2029';

test("text from the CMS cannot close the script block", () => {
  const out = serializeJsonLd({ "@type": "Question", name: HOSTILE });
  assert.doesNotMatch(out, /[<>&\u2028\u2029]/);
});

test("search engines read exactly the same data back", () => {
  const data = { "@context": "https://schema.org", name: HOSTILE, nested: [{ text: "a < b > c & d" }], n: 3, no: null };
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});

test("every JSON-LD block goes through the one safe component", () => {
  const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(dir, e.name)] : []));
  const allowed = path.join("src", "components", "system", "JsonLd.tsx");
  const offenders = files("src").filter((f) => f !== allowed && readFileSync(f, "utf8").includes("application/ld+json"));
  assert.deepEqual(offenders, []);
});
