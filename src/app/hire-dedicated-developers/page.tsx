import EngagementModelPage, { engagementModelMetadata, requireEngagementModel } from "@/components/engagement/EngagementModelPage";

const SLUG = "hire-dedicated-developers";

export const metadata = engagementModelMetadata(SLUG);

export default function HireDedicatedDevelopersPage() {
  return <EngagementModelPage model={requireEngagementModel(SLUG)} />;
}
