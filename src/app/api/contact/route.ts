import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { SERVICE_GROUPS } from "@/data/services";
import { isEmail, submit, text, tooMany } from "@/lib/intake";
import { refuseJsonPost } from "@/lib/requestGuard";
import { cleanPageUrl } from "@/lib/pageUrl";
import { BUDGETS, CONTACT_REASONS, NEW_PROJECT } from "@/lib/contactOptions";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** Contact form. The CMS saves the lead and emails the team (see lib/intake). */
export async function POST(request: Request) {
  // first, so a refused request uses up nobody's allowance
  const refused = refuseJsonPost(request);
  if (refused) return refused;
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
  // why they write (the contact form asks; the homepage form does not, so it means a project)
  const reasonIn = text(body.reason, 40);
  const reason = CONTACT_REASONS.find((r) => r === reasonIn);
  if (reasonIn && !reason) return fail("Please choose why you are writing.");
  const isProject = !reason || reason === NEW_PROJECT;
  const service = isProject ? text(body.service, 120) : reason;
  if (!service) return fail("Please choose what you are looking for.");
  const budgetIn = text(body.budget, 40);
  const budget = isProject ? BUDGETS.find((b) => b === budgetIn) : undefined;

  const id = text(body.submission_id, 36);
  const fields: Record<string, string | undefined> = {
    submission_id: UUID.test(id) ? id.toLowerCase() : randomUUID(),
    name,
    email: body.email.trim(),
    service: service === "other" ? "Other" : (SERVICE_GROUPS.find((g) => g.slug === service)?.name ?? service),
    reason: reason ?? NEW_PROJECT,
    budget,
    phone: text(body.phone, 40),
    industry: text(body.industry, 120),
    timeline: text(body.timeline, 60),
    brief: text(body.brief, 5000),
    // never the query: it may hold something the visitor typed
    page_url: cleanPageUrl(request.headers.get("referer")),
  };
  const result = await submit({
    kind: "leads",
    // only what was given: empty optional fields are not sent
    data: Object.fromEntries(Object.entries(fields).filter((e): e is [string, string] => !!e[1])),
  });

  if (result === "invalid") return fail("Please check your email address and try again.");
  if (result === "failed") return fail("We could not receive that just now. Please try again in a few minutes.", 503);
  return NextResponse.json({ ok: true });
}
