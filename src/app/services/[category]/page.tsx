import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/system/SiteShell";
import CardGridPage from "@/components/system/CardGridPage";
import { SERVICE_COLUMNS } from "@/lib/navigation";

export function generateStaticParams() {
  return SERVICE_COLUMNS.map((col) => ({ category: col.id }));
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
