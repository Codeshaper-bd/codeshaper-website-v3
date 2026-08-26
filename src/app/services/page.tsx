import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import CardGridPage from "@/components/system/CardGridPage";
import { SERVICE_COLUMNS } from "@/lib/navigation";
import { SERVICE_ICONS } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product design, engineering, websites, commerce, and AI automation — five practices, one delivery system, one accountable team.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndexPage() {
  return (
    <SiteShell>
      <CardGridPage
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="Services"
        title="Five practices, one delivery system."
        intro="Every engagement moves through the same disciplines — from first sketch to a shipped, supported product. Pick a practice to see what's inside."
        items={SERVICE_COLUMNS.map((col) => ({
          icon: SERVICE_ICONS[col.id],
          title: col.title,
          description: col.blurb,
          href: col.href,
          meta: col.tags,
        }))}
      />
    </SiteShell>
  );
}
