import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import CardGridPage from "@/components/system/CardGridPage";
import { ENGAGEMENT_MODELS } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Engagement Models",
  description:
    "Flexible ways to work with CodeShaper — MVP sprints, end-to-end delivery, a dedicated product team, team augmentation, or global delivery.",
  alternates: { canonical: "/engagement" },
};

export default function EngagementIndexPage() {
  return (
    <SiteShell>
      <CardGridPage
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Engagement Models" }]}
        eyebrow="Engagement Models"
        title="Flexible ways to work with us."
        intro="Choose the model that matches your scope certainty, timeline, and team structure."
        items={ENGAGEMENT_MODELS.map((m) => ({
          icon: m.icon,
          title: m.label,
          description: m.longDescription,
          href: m.href,
          meta: m.desc,
        }))}
      />
    </SiteShell>
  );
}
