import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/system/SiteShell";
import DetailPage from "@/components/system/DetailPage";
import { SERVICE_COLUMNS, findBySlug, slugFromHref } from "@/lib/navigation";

function findService(category: string, service: string) {
  const col = SERVICE_COLUMNS.find((c) => c.id === category);
  if (!col) return null;
  const link = findBySlug(col.links, service);
  if (!link) return null;
  return { col, link };
}

export function generateStaticParams() {
  return SERVICE_COLUMNS.flatMap((col) =>
    col.links.map((link) => ({ category: col.id, service: slugFromHref(link.href) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; service: string }>;
}): Promise<Metadata> {
  const { category, service } = await params;
  const found = findService(category, service);
  if (!found) return {};
  return {
    title: found.link.label,
    description: found.link.longDescription,
    alternates: { canonical: found.link.href },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ category: string; service: string }>;
}) {
  const { category, service } = await params;
  const found = findService(category, service);
  if (!found) notFound();
  const { col, link } = found;

  return (
    <SiteShell>
      <DetailPage
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: col.title, href: col.href },
          { label: link.label },
        ]}
        icon={link.icon}
        eyebrow={col.title}
        title={link.label}
        intro={link.longDescription}
        ctaLabel="Talk about this service"
        relatedTitle={`More in ${col.title}`}
        related={col.links
          .filter((l) => l.href !== link.href)
          .map((l) => ({ title: l.label, description: l.desc, href: l.href, icon: l.icon }))}
      />
    </SiteShell>
  );
}
