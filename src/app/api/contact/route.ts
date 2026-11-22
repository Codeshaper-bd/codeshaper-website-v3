import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { SERVICE_GROUPS } from "@/data/services";
import { isEmail, submit, text, tooMany } from "@/lib/intake";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** Contact form. The CMS saves the lead and emails the team (see lib/intake). */
export async function POST(request: Request) {
  if (tooMany(request, "contact")) return fail("Too many messages in a short time. Please try again in ten minutes.", 429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.");
  }
  if (!body || typeof body !== "object") return fail("Invalid request body.");

  // hidden field: people never see it, bots fill it in
  if (text(body.company_website, 10)) return NextResponse.json({ ok: true });

  const name = text(body.name, 120);
  if (!name) return fail("Name is required.");
  if (!isEmail(body.email)) return fail("A valid email is required.");
  const service = text(body.service, 120);
  if (!service) return fail("Service interest is required.");

  const id = text(body.submission_id, 36);
  const result = await submit({
    kind: "leads",
    data: {
      submission_id: UUID.test(id) ? id.toLowerCase() : randomUUID(),
      name,
      email: body.email.trim(),
      service: SERVICE_GROUPS.find((g) => g.slug === service)?.name ?? service,
      industry: text(body.industry, 120),
      timeline: text(body.timeline, 60),
      brief: text(body.brief, 5000),
      page_url: text(request.headers.get("referer"), 500),
    },
  });

  if (result === "invalid") return fail("Please check your email address and try again.");
  if (result === "failed") return fail("We could not receive that just now. Please try again in a few minutes.", 503);
  return NextResponse.json({ ok: true });
}
