/**
 * The form APIs take JSON from our own pages only. Without this, any website could make its visitors'
 * browsers send leads and signups (a plain HTML form can post text/plain that parses as JSON), each
 * from a different address, past the per-visitor limits.
 *
 * Requiring application/json stops that: another origin cannot send it without a CORS permission we
 * never give. Sec-Fetch-Site is a second check. Neither stops a script run outside a browser; the
 * rate limits are for that.
 */
const OTHERS = new Set(["cross-site", "same-site"]);

/** True when a browser says the request was started by a page on another origin. */
export const fromAnotherSite = (headers: Headers) => OTHERS.has(headers.get("sec-fetch-site") ?? "");

/** The refusal to send back, or null when the request may go on. */
export function refuseJsonPost(request: Request): Response | null {
  const type = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const status = type !== "application/json" ? 415 : fromAnotherSite(request.headers) ? 403 : null;
  return status ? Response.json({ ok: false, error: "This request was not accepted." }, { status }) : null;
}
