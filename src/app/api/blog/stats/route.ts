import { NextResponse } from "next/server";
import { getStats, incrementView, addReaction, REACTIONS } from "@/lib/blogStats";
import { getPostBySlug } from "@/lib/blog";

const REACTION_IDS = new Set(REACTIONS.map((r) => r.id));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug || !getPostBySlug(slug)) {
    return NextResponse.json({ error: "Unknown post." }, { status: 404 });
  }
  return NextResponse.json(getStats(slug));
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { slug, action } = body;
  if (typeof slug !== "string" || !getPostBySlug(slug)) {
    return NextResponse.json({ error: "Unknown post." }, { status: 404 });
  }

  if (action === "view") {
    return NextResponse.json(incrementView(slug));
  }

  if (action === "react") {
    const reaction = body.reaction;
    if (typeof reaction !== "string" || !REACTION_IDS.has(reaction as never)) {
      return NextResponse.json({ error: "Unknown reaction." }, { status: 400 });
    }
    return NextResponse.json(addReaction(slug, reaction));
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
