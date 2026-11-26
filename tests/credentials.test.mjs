import { test } from "node:test";
import assert from "node:assert/strict";
import { acceptsPublish, redact, signingKeys, tokenFor } from "../src/lib/credentials.mjs";

const NAMES = { leads: "CMS_TOKEN_LEADS", subscribers: "CMS_TOKEN_SUBSCRIBERS", blog: "CMS_TOKEN_BLOG", content: "CMS_TOKEN_CONTENT", preview: "CMS_TOKEN_PREVIEW", publish_status: "CMS_TOKEN_PUBLISH_STATUS" };
const scoped = () => ({ ...Object.fromEntries(Object.entries(NAMES).map(([s, n]) => [n, `${s}-secret`])), SITE_TOKEN_PUBLISH: "publish-secret", PREVIEW_SIGNING_KEY: "signing-secret" });

test("each operation sends only its own secret", () => {
  for (const scope of Object.keys(NAMES)) assert.equal(tokenFor(scope, scoped()), `${scope}-secret`);
});

test("an unknown operation gets nothing, even with the old shared token", () => {
  assert.equal(tokenFor("ai_gateway", { CMS_INTAKE_TOKEN: "old" }), "");
  assert.equal(tokenFor("anything", { CMS_INTAKE_TOKEN: "old" }), "");
});

test("until an operation has its own secret it uses the old shared token", () => {
  assert.equal(tokenFor("leads", { CMS_INTAKE_TOKEN: "old" }), "old");
  assert.equal(tokenFor("leads", { CMS_INTAKE_TOKEN: "old", CMS_TOKEN_LEADS: "new" }), "new");
  assert.equal(tokenFor("leads", {}), "");
});

test("only the publish secret may ask for a website update", () => {
  const env = scoped();
  assert.equal(acceptsPublish("Bearer publish-secret", env), true);
  for (const other of [...Object.keys(NAMES).map((s) => `${s}-secret`), "signing-secret", "publish-secre", "publish-secret2", ""]) {
    assert.equal(acceptsPublish(`Bearer ${other}`, env), false, other);
  }
  assert.equal(acceptsPublish("publish-secret", env), false);
  assert.equal(acceptsPublish(null, env), false);
  assert.equal(acceptsPublish("Bearer ", {}), false);
});

test("publish accepts the previous secret while rotating, and the old token only while it is set", () => {
  const env = { ...scoped(), SITE_TOKEN_PUBLISH_PREVIOUS: "earlier", CMS_INTAKE_TOKEN: "old" };
  assert.equal(acceptsPublish("Bearer earlier", env), true);
  assert.equal(acceptsPublish("Bearer old", env), true);
  delete env.CMS_INTAKE_TOKEN;
  assert.equal(acceptsPublish("Bearer old", env), false);
});

test("preview links are checked with the signing key, never with a request token", () => {
  assert.deepEqual(signingKeys(scoped()), ["signing-secret"]);
  assert.deepEqual(signingKeys({ PREVIEW_SIGNING_KEY: "a", PREVIEW_SIGNING_KEY_PREVIOUS: "b", CMS_INTAKE_TOKEN: "old" }), ["a", "b", "old"]);
  assert.deepEqual(signingKeys({ CMS_TOKEN_PREVIEW: "x" }), []);
});

test("secrets are removed from messages before they leave the server", () => {
  const env = { ...scoped(), CMS_INTAKE_TOKEN: "old-shared-secret" };
  const out = redact("failed: Bearer leads-secret and old-shared-secret / publish-secret", env);
  assert.equal(out, "failed: Bearer [redacted] and [redacted] / [redacted]");
});
