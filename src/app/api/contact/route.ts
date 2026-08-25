import { NextResponse } from "next/server";

/**
 * Contact form submission endpoint.
 *
 * TODO before real launch: this only validates and logs server-side —
 * it does NOT email or CRM-forward anything yet, since that requires a
 * real decision (which inbox, which CRM/ESP, API keys) only the site
 * owner can make. Wire this to that service once chosen (Resend,
 * SendGrid, HubSpot, etc.) — the validation/shape below stays the same,
 * only the body of the try block changes.
 *
 * Still a real improvement over what existed before: every "Book a
 * Call" / "Start a Project" CTA on the site pointed at a page that
 * couldn't accept a submission at all (a generic dev stub). This at
 * least accepts, validates, and durably logs the request server-side.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, service, industry, timeline, brief } = body;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }
  if (typeof service !== "string" || !service.trim()) {
    return NextResponse.json({ ok: false, error: "Service interest is required." }, { status: 400 });
  }

  // eslint-disable-next-line no-console -- placeholder sink until a real email/CRM integration exists
  console.log("[contact] submission received:", { name, email, service, industry, timeline, brief });

  return NextResponse.json({ ok: true });
}
