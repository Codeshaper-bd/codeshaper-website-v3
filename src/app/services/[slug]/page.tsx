import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceGroupPage from "@/components/services/ServiceGroupPage";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { SERVICE_GROUPS, SERVICES, getGroup, getService, servicePath } from "@/data/services";
import { pageMetadata } from "@/lib/pageMetadata";

/**
 * /services/<slug> serves both group pages and service detail pages —
 * group and service slugs share one namespace (uniqueness is asserted in
 * src/data/services.ts).
 *
 * The flagship group, ai-agents-automation, is excluded: it has its own
 * static route (app/services/ai-agents-automation/page.tsx), which takes
 * precedence over this dynamic one, and generating it here too would
 * build a duplicate path.
 */
const BESPOKE_GROUPS = new Set(["ai-agents-automation"]);

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...SERVICE_GROUPS.filter((g) => !BESPOKE_GROUPS.has(g.slug)).map((g) => ({ slug: g.slug })),
    ...SERVICES.map((s) => ({ slug: s.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGroup(slug) ?? getService(slug);
  if (!entry) return {};
  return pageMetadata({ title: entry.metaTitle, description: entry.metaDescription, path: servicePath(slug) });
}

export default async function ServiceSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = getGroup(slug);
  if (group) return <ServiceGroupPage group={group} />;
  const service = getService(slug);
  if (service) return <ServiceDetailPage service={service} />;
  notFound();
}
