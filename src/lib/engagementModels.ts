import type { LucideIcon } from "lucide-react";
import { Rocket, Boxes, Users, UserPlus, Globe2 } from "lucide-react";
import { ENGAGEMENT_MODELS } from "@/data/services";

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

/**
 * Card visuals (icon, accent, one-line fit) per engagement model. Names
 * and routes come from ENGAGEMENT_MODELS in src/data/services.ts, in its
 * locked order, so the cards can't drift from the menus.
 */
const CARD_VISUALS: Record<string, Omit<ModelCardData, "name" | "href">> = {
  "/engagement/mvp-sprint": { fit: "Fastest lane from idea to a shippable first product.", icon: Rocket, accent: "#8a7bff" },
  "/engagement/end-to-end-delivery": { fit: "We own the full build against an agreed scope.", icon: Boxes, accent: "#5b9bdb" },
  "/hire-dedicated-developers": { fit: "A stable team embedded on your roadmap.", icon: Users, accent: "#3fae82" },
  "/staff-augmentation": { fit: "Specialists slot into your existing team.", icon: UserPlus, accent: "#d99a4e" },
  "/offshore-development-center": { fit: "Your own long-term offshore team, run by us.", icon: Globe2, accent: "#db5a89" },
};

export const ENGAGEMENT_MODEL_CARDS: ModelCardData[] = ENGAGEMENT_MODELS.map((m) => {
  const visuals = CARD_VISUALS[m.href];
  if (!visuals) throw new Error(`No card visuals for engagement model ${m.href}`);
  return { name: m.label, href: m.href, ...visuals };
});
