import type { LucideIcon } from "lucide-react";
import { Rocket, Boxes, Users, UserPlus, Globe2 } from "lucide-react";

/**
 * Plain data — deliberately NOT in the "use client" component file
 * (components/system/EngagementModelCards.tsx). Importing a data export
 * from a "use client" module into a Server Component doesn't survive
 * the RSC boundary the way a component export does (confirmed:
 * `ENGAGEMENT_MODEL_CARDS.map is not a function` at runtime when
 * DeliveryModelsStrip, a server component, imported it from there) —
 * only actual component exports get the client-reference treatment.
 * Data lives here instead; the client file imports the type from here.
 */
export type ModelCardData = {
  name: string;
  fit: string;
  icon: LucideIcon;
  accent: string;
  href: string;
};

export const ENGAGEMENT_MODEL_CARDS: ModelCardData[] = [
  {
    name: "MVP Sprint",
    fit: "Fastest lane from idea to a shippable first product.",
    icon: Rocket,
    accent: "#8a7bff",
    href: "/engagement/mvp-sprint",
  },
  {
    name: "End-to-End Delivery",
    fit: "We own the full build against an agreed scope.",
    icon: Boxes,
    accent: "#5b9bdb",
    href: "/engagement/end-to-end-delivery",
  },
  {
    name: "Dedicated Product Team",
    fit: "A stable squad embedded on your roadmap.",
    icon: Users,
    accent: "#3fae82",
    href: "/engagement/dedicated-team",
  },
  {
    name: "Team Augmentation",
    fit: "Specialists slot into your existing team.",
    icon: UserPlus,
    accent: "#d99a4e",
    href: "/engagement/team-augmentation",
  },
  {
    name: "Global Delivery Model",
    fit: "Distributed build, single-point accountability.",
    icon: Globe2,
    accent: "#db5a89",
    href: "/engagement/global-delivery",
  },
];
