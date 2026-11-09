import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EngagementModelPage, { engagementModelMetadata } from "@/components/engagement/EngagementModelPage";
import { ENGAGEMENT_MODELS, getEngagementModel } from "@/data/services";
import { slugFromHref } from "@/lib/navigation";

/**
 * Only engagement models whose route lives under /engagement/ are built
 * here. "mvp-sprint" is excluded — it has its own bespoke static route
 * (app/engagement/mvp-sprint/page.tsx), and generating it here too would
 * build a duplicate path. The three hiring models live at top-level
 * routes (/hire-dedicated-developers, etc.); their old /engagement/*
 * URLs 301-redirect there (next.config.ts).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return ENGAGEMENT_MODELS.filter((m) => m.href.startsWith("/engagement/") && slugFromHref(m.href) !== "mvp-sprint").map((m) => ({
    model: slugFromHref(m.href),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  return engagementModelMetadata(model);
}

export default async function EngagementDetailPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const m = getEngagementModel(model);
  if (!m || !m.href.startsWith("/engagement/")) notFound();
  return <EngagementModelPage model={m} />;
}
