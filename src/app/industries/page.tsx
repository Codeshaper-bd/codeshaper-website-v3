import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import CardGridPage from "@/components/system/CardGridPage";
import { INDUSTRIES } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Industry workflows built with product taste — SaaS, eCommerce, FinTech, real estate, logistics, travel, and more.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesIndexPage() {
  return (
    <SiteShell>
      <CardGridPage
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        eyebrow="Industries"
        title="Industry workflows, built with product taste."
        intro="Adapted to what makes each business different: integrations, approvals, journeys, and handover."
        items={INDUSTRIES.map((ind) => ({
          icon: ind.icon,
          title: ind.label,
          description: ind.summary,
          href: ind.href,
          meta: ind.desc,
        }))}
      />
    </SiteShell>
  );
}
