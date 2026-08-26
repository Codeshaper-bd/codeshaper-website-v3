import { NextResponse } from "next/server";

/**
 * Newsletter signup endpoint — same shape and same caveat as
 * /api/contact: validates and logs server-side only. Does NOT send to
 * an email service provider yet, since that requires a real decision
 * (Mailchimp, ConvertKit, Resend Broadcasts, etc.) only the site owner
 * can make. Wire it up here once chosen.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { email, role } = body;

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }

  // eslint-disable-next-line no-console -- placeholder sink until a real ESP integration exists
  console.log("[newsletter] signup received:", { email, role });

  return NextResponse.json({ ok: true });
}
