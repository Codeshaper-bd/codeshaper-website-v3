import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryPage from "@/components/industries/IndustryPage";
import { industryDetail, withSeo } from "@/lib/details";
import { INDUSTRIES, findBySlug, slugFromHref } from "@/lib/navigation";

/**
 * "saas" is excluded here — it now has its own bespoke static route at
 * app/industries/saas/page.tsx, which Next.js's static/literal segment
 * already takes precedence over this dynamic one for exact matches.
 * Still generating a "saas" param here would build a duplicate static
 * path and fail the build.
 */
export function generateStaticParams() {
  return INDUSTRIES.filter((i) => slugFromHref(i.href) !== "saas").map((i) => ({ industry: slugFromHref(i.href) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry } = await params;
  const ind = findBySlug(INDUSTRIES, industry);
  if (!ind) return {};
  return withSeo({ title: ind.label, description: ind.summary, alternates: { canonical: ind.href } }, industryDetail(industry).seo);
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry } = await params;
  const ind = findBySlug(INDUSTRIES, industry);
  if (!ind) notFound();

  return <IndustryPage industry={ind} />;
}
