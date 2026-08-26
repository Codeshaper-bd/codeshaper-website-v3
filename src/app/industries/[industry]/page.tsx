import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/system/SiteShell";
import DetailPage from "@/components/system/DetailPage";
import { INDUSTRIES } from "@/lib/navigation";

function findIndustry(industry: string) {
  return INDUSTRIES.find((i) => i.href.endsWith(`/${industry}`)) ?? null;
}

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.href.split("/").pop()! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry } = await params;
  const ind = findIndustry(industry);
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
  const ind = findIndustry(industry);
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
