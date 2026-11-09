import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import DetailPage from "@/components/system/DetailPage";
import { ENGAGEMENT_MODELS, getEngagementModel, type EngagementModel } from "@/data/services";
import { pageMetadata } from "@/lib/pageMetadata";
import { SITE_NAME } from "@/lib/site";

/**
 * Shared page for engagement models that don't have a bespoke page
 * (MVP Sprint does). Rendered by app/engagement/[model] for the
 * /engagement/* models, and by the three top-level hiring routes
 * (/hire-dedicated-developers, /staff-augmentation,
 * /offshore-development-center).
 */
export function engagementModelMetadata(slug: string): Metadata {
  const m = getEngagementModel(slug);
  if (!m) return {};
  return pageMetadata({ title: `${m.title} | ${SITE_NAME}`, description: m.metaDescription, path: m.href });
}

export function requireEngagementModel(slug: string): EngagementModel {
  const m = getEngagementModel(slug);
  if (!m) throw new Error(`Unknown engagement model "${slug}"`);
  return m;
}

export default function EngagementModelPage({ model: m }: { model: EngagementModel }) {
  return (
    <SiteShell>
      <DetailPage
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Engagement Models", href: "/engagement" }, { label: m.label }]}
        icon={m.icon}
        eyebrow="Engagement Models"
        title={m.title}
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
