import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/system/SiteShell";
import CardGridPage from "@/components/system/CardGridPage";
import { SERVICE_COLUMNS } from "@/lib/navigation";

/**
 * "ai" is excluded here — it now has its own bespoke static route at
 * app/services/ai/page.tsx, which Next.js's static/literal segment
 * already takes precedence over this dynamic one for exact matches.
 * Still generating an "ai" param here would build a duplicate static
 * path and fail the build.
 */
export function generateStaticParams() {
  return SERVICE_COLUMNS.filter((col) => col.id !== "ai").map((col) => ({ category: col.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const col = SERVICE_COLUMNS.find((c) => c.id === category);
  if (!col) return {};
  return {
    title: col.title,
    description: col.blurb,
    alternates: { canonical: col.href },
  };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const col = SERVICE_COLUMNS.find((c) => c.id === category);
  if (!col) notFound();

  return (
    <SiteShell>
      <CardGridPage
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: col.title }]}
        eyebrow={`Services · ${col.number}`}
        title={col.title}
        intro={col.blurb}
        items={col.links.map((link) => ({
          icon: link.icon,
          title: link.label,
          description: link.desc,
          href: link.href,
        }))}
      />
    </SiteShell>
  );
}
