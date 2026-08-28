import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/system/SiteShell";
import DetailPage from "@/components/system/DetailPage";
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
  return {
    title: ind.label,
    description: ind.summary,
    alternates: { canonical: ind.href },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry } = await params;
  const ind = findBySlug(INDUSTRIES, industry);
  if (!ind) notFound();

  return (
    <SiteShell>
      <DetailPage
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: ind.label }]}
        icon={ind.icon}
        eyebrow="Industries"
        title={ind.label}
        intro={ind.summary}
        facts={[ind.outcome, ...ind.systems]}
        ctaLabel="Talk about your industry"
        relatedTitle="Other industries"
        related={INDUSTRIES.filter((i) => i.href !== ind.href)
          .slice(0, 4)
          .map((i) => ({ title: i.label, description: i.desc, href: i.href, icon: i.icon }))}
      />
    </SiteShell>
  );
}
