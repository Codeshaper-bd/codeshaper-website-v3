import { NextResponse } from "next/server";
import { isEmail, submit, text, tooMany } from "@/lib/intake";

export const runtime = "nodejs";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** Newsletter signup. Saved in the CMS (see lib/intake). */
export async function POST(request: Request) {
  if (tooMany(request, "newsletter")) return fail("Too many tries in a short time. Please try again in ten minutes.", 429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.");
  }
  if (!body || typeof body !== "object") return fail("Invalid request body.");
  if (text(body.company_website, 10)) return NextResponse.json({ ok: true });
  if (!isEmail(body.email)) return fail("A valid email is required.");

  const result = await submit({ kind: "subscribers", data: { email: body.email.trim() } });
  if (result === "invalid") return fail("Please check your email address and try again.");
  if (result === "failed") return fail("We could not receive that just now. Please try again in a few minutes.", 503);
  return NextResponse.json({ ok: true });
}
