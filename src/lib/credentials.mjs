/**
 * The secrets this server shares with the CMS, one for each kind of work, so a leaked one opens only
 * its own door. Server only: none has a NEXT_PUBLIC_ name. Used by the website and by scripts/.
 *
 * CMS_INTAKE_TOKEN is the old single shared token: used and accepted only while it is set, so the two
 * servers can be updated one at a time. See ../codeshaper-cms/deploy/credentials.md.
 */
import { createHash, timingSafeEqual } from "node:crypto";

/** What this server sends to the CMS. */
export const CMS_SCOPES = Object.freeze({
  leads: "CMS_TOKEN_LEADS",
  subscribers: "CMS_TOKEN_SUBSCRIBERS",
  blog: "CMS_TOKEN_BLOG",
  content: "CMS_TOKEN_CONTENT",
  preview: "CMS_TOKEN_PREVIEW",
  publish_status: "CMS_TOKEN_PUBLISH_STATUS",
});

/** Signs requests to the CMS's AI routes (lib/ai/gateway). It is never sent, and the old shared token never stands in for it. */
export const AI_GATEWAY_KEY = "CMS_TOKEN_AI_GATEWAY";

const SECRET_NAMES = [...Object.values(CMS_SCOPES), AI_GATEWAY_KEY, "SITE_TOKEN_PUBLISH", "SITE_TOKEN_PUBLISH_PREVIOUS", "PREVIEW_SIGNING_KEY", "PREVIEW_SIGNING_KEY_PREVIOUS", "CMS_INTAKE_TOKEN"];

/** @param {string} scope @param {Record<string, string | undefined>} [env] */
export function tokenFor(scope, env = process.env) {
  if (!Object.hasOwn(CMS_SCOPES, scope)) return "";
  return env[CMS_SCOPES[/** @type {keyof typeof CMS_SCOPES} */ (scope)]] || env.CMS_INTAKE_TOKEN || "";
}

/** Same time whatever is wrong: both sides are hashed first, so not even the length shows. */
export function safeEqual(/** @type {string} */ a, /** @type {string} */ b) {
  const digest = (/** @type {string} */ v) => createHash("sha256").update(v).digest();
  return timingSafeEqual(digest(a), digest(b));
}

/** May this Authorization header ask the website to update itself? @param {string | null} header @param {Record<string, string | undefined>} [env] */
export function acceptsPublish(header, env = process.env) {
  const allowed = [env.SITE_TOKEN_PUBLISH, env.SITE_TOKEN_PUBLISH_PREVIOUS, env.CMS_INTAKE_TOKEN].filter(Boolean);
  // every candidate is compared, so timing does not say which one matched
  return allowed.map((token) => safeEqual(`Bearer ${token}`, header ?? "")).includes(true);
}

/** Keys a preview link may be signed with. @param {Record<string, string | undefined>} [env] @returns {string[]} */
export function signingKeys(env = process.env) {
  return /** @type {string[]} */ ([env.PREVIEW_SIGNING_KEY, env.PREVIEW_SIGNING_KEY_PREVIOUS, env.CMS_INTAKE_TOKEN].filter(Boolean));
}

/** Takes every secret out of a message that is about to be logged or sent somewhere. @param {string} message @param {Record<string, string | undefined>} [env] */
export function redact(message, env = process.env) {
  const values = SECRET_NAMES.map((n) => env[n] ?? "").filter((v) => v.length >= 6);
  return values.sort((a, b) => b.length - a.length).reduce((text, v) => text.split(v).join("[redacted]"), message);
}
