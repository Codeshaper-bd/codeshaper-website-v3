import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/system/SiteShell";
import DetailPage from "@/components/system/DetailPage";
import { ENGAGEMENT_MODELS, findBySlug, slugFromHref } from "@/lib/navigation";

export function generateStaticParams() {
  return ENGAGEMENT_MODELS.map((m) => ({ model: slugFromHref(m.href) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ model: string }>;
}): Promise<Metadata> {
  const { model } = await params;
  const m = findBySlug(ENGAGEMENT_MODELS, model);
  if (!m) return {};
  return {
    title: m.label,
    description: m.longDescription,
    alternates: { canonical: m.href },
  };
}

export default async function EngagementDetailPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;
  const m = findBySlug(ENGAGEMENT_MODELS, model);
  if (!m) notFound();

  return (
    <SiteShell>
      <DetailPage
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Engagement Models", href: "/engagement" }, { label: m.label }]}
        icon={m.icon}
        eyebrow="Engagement Models"
        title={m.label}
        intro={m.longDescription}
        facts={[m.desc]}
        ctaLabel="Start with this model"
        relatedTitle="Other engagement models"
        related={ENGAGEMENT_MODELS.filter((x) => x.href !== m.href).map((x) => ({
          title: x.label,
          description: x.desc,
          href: x.href,
          icon: x.icon,
        }))}
      />
    </SiteShell>
  );
}
