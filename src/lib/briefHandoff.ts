/**
 * Carries what a visitor typed (the hero box, a "Start a project" button) to the contact form without
 * putting it in an address, where it would stay in the browser history, server logs, referrers and
 * analytics.
 *
 * With the page's script: the words wait in this tab's sessionStorage and are removed as soon as the
 * form takes them. They never leave the browser before the visitor presses the form's own button.
 * Without it (or before it is ready): the form POSTs to /contact/continue, which answers with the
 * visitor's own words on a page that is not stored anywhere.
 *
 * Also here, because it answers with the same kind of page: the newsletter box posted as a plain form
 * (newsletterFormResponse).
 *
 * No framework imports, so the tests can run it as it is.
 */
export const BRIEF_KEY = "cs-brief";
export const BRIEF_MAX = 1000;
/** The homepage message box allows more than the hero does. */
const POSTED_MAX = 5000;
const BODY_MAX = 32_000;

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const tabStore = (): Store => window.sessionStorage;

/** False when the browser blocks storage: the caller then lets the form POST instead. */
export function saveBrief(text: string, store?: Store): boolean {
  try {
    (store ?? tabStore()).setItem(BRIEF_KEY, text.slice(0, BRIEF_MAX));
    return true;
  } catch {
    return false;
  }
}

/** Hands the words over once. */
export function takeBrief(store?: Store): string {
  try {
    const s = store ?? tabStore();
    const text = s.getItem(BRIEF_KEY) ?? "";
    s.removeItem(BRIEF_KEY);
    return text.slice(0, BRIEF_MAX);
  } catch {
    return "";
  }
}

const escape = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

// fixed text: the words are read from the page, never written into the script. Its hash is in the policy.
const SCRIPT = `var b=document.getElementById("brief");try{if(b.value){sessionStorage.setItem("${BRIEF_KEY}",b.value.slice(0,${BRIEF_MAX}))}else{sessionStorage.removeItem("${BRIEF_KEY}")}location.replace("/contact")}catch(e){}`;

const redirect = (to: string) => new Response(null, { status: 303, headers: { Location: to, "Cache-Control": "no-store" } });
const toContact = () => redirect("/contact");
// the same two values as lib/requestGuard (kept here so this file stays import-free)
const anotherSite = (request: Request) => ["cross-site", "same-site"].includes(request.headers.get("sec-fetch-site") ?? "");

const STYLE = `body{margin:0;background:#f6f4f1;color:#0b0f19;font:16px/1.6 system-ui,sans-serif}main{max-width:640px;margin:48px auto;padding:28px;background:#fff;border-radius:24px}h1{margin:0 0 8px;font-size:24px}textarea{box-sizing:border-box;width:100%;padding:14px;border:1px solid #d9d9e3;border-radius:12px;font:inherit}a{color:#4f46e5}`;

/** A small page that is never stored, indexed, framed or passed on as a referrer. Pass `script` only as fixed text. */
async function plainPage(title: string, body: string, status = 200, script = ""): Promise<Response> {
  let scripts = "'none'";
  if (script) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(script));
    scripts = `'sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}'`;
  }
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title} · CodeShaper</title>
<style>${STYLE}</style></head>
<body><main><h1>${title}</h1>
${body}</main>
${script ? `<script>${script}</script>` : ""}</body></html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Strict-Transport-Security": "max-age=31536000",
      "Content-Security-Policy": `default-src 'none'; style-src 'unsafe-inline'; script-src ${scripts}; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
    },
  });
}

/** Answers POST /contact/continue. Nothing is saved, logged or sent anywhere. */
export async function continueResponse(request: Request, contact: { email: string; phone: string }): Promise<Response> {
  // another site must not be able to place its words in front of our visitor
  if (anotherSite(request)) return toContact();
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX) return toContact();
  let words: string;
  try {
    const form = await request.formData();
    words = String(form.get("brief") ?? "").slice(0, POSTED_MAX);
  } catch {
    return toContact();
  }

  return plainPage(
    "Continue your enquiry",
    `<p><strong>Nothing has been sent yet.</strong> Our contact form needs JavaScript. To reach us without it, copy your words and email them to <a href="mailto:${escape(contact.email)}">${escape(contact.email)}</a>, or call ${escape(contact.phone)}.</p>
<label for="brief">Your words</label>
<textarea id="brief" rows="8" readonly>${escape(words)}</textarea>
<p><a href="/contact">Open the contact page</a></p>`,
    200,
    SCRIPT,
  );
}

type Signup = { limited: () => boolean; subscribe: (email: string) => Promise<"ok" | "invalid" | "failed"> };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACK = `<p><a href="/blog">Back to the blog</a></p>`;

/** Answers POST /newsletter/subscribe: the newsletter box sent without the page's script. The address is never shown back. */
export async function newsletterFormResponse(request: Request, { limited, subscribe }: Signup): Promise<Response> {
  if (anotherSite(request)) return redirect("/");
  const page = (title: string, text: string, status = 200) => plainPage(title, `<p>${text}</p>\n${BACK}`, status);
  const invalid = () => page("Please check your email address", "That address did not look right. Go back and try again.", 400);
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX) return invalid();
  if (limited()) return page("Please try again later", "Too many tries in a short time. Please try again in ten minutes.", 429);
  let email: string, bot: string;
  try {
    const form = await request.formData();
    email = String(form.get("email") ?? "").trim();
    bot = String(form.get("company_website") ?? "");
  } catch {
    return invalid();
  }
  const done = () => page("You&#39;re subscribed", "The next article will find you.");
  if (bot) return done();
  if (email.length > 255 || !EMAIL.test(email)) return invalid();
  const result = await subscribe(email);
  if (result === "invalid") return invalid();
  if (result === "failed") return page("That did not work", "We could not take your signup just now. Please try again in a few minutes.", 503);
  return done();
}
