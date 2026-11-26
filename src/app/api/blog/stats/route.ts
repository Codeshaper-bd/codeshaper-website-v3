import { NextResponse } from "next/server";
import { getTotals, record } from "@/lib/blogStats";
import { REACTIONS, type BlogEvent } from "@/lib/blogReactions";
import { getPostBySlug } from "@/lib/blog";
import { tooMany } from "@/lib/intake";
import { fromAnotherSite } from "@/lib/requestGuard";

export const runtime = "nodejs";

const REACTION_IDS = new Set<string>(REACTIONS.map((r) => r.id));
// crawlers, previews and monitors are not readers
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|lighthouse|headless|monitor|curl|wget|python|axios|node-fetch/i;

/** Public numbers for every post: { slug: { reads, reactions } }. */
export async function GET() {
  return NextResponse.json(await getTotals(), { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}

/** One reader event: view | read | time | react. Accepts sendBeacon (text/plain) too. */
export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return NextResponse.json({ ok: true });
  // beacons are text/plain, so only the browser's own word keeps other sites from counting reads
  if (fromAnotherSite(request.headers)) return NextResponse.json({ error: "Not accepted." }, { status: 403 });
  // an allowance of its own: nothing here can slow the forms down
  if (tooMany(request, "blog")) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { slug, event } = body;
  if (typeof slug !== "string" || !getPostBySlug(slug)) return NextResponse.json({ error: "Unknown post." }, { status: 404 });

  let e: BlogEvent;
  if (event === "view" || event === "read") e = { slug, event };
  else if (event === "time") {
    const seconds = Math.round(Number(body.seconds));
    if (!Number.isFinite(seconds) || seconds < 1) return NextResponse.json({ ok: true });
    e = { slug, event, seconds: Math.min(seconds, 3600) };
  } else if (event === "react" && typeof body.reaction === "string" && REACTION_IDS.has(body.reaction)) {
    e = { slug, event, reaction: body.reaction as (typeof REACTIONS)[number]["id"] };
  } else return NextResponse.json({ error: "Unknown event." }, { status: 400 });

  await record(e);
  return NextResponse.json({ ok: true });
}
