import EngagementModelPage, { engagementModelMetadata, requireEngagementModel } from "@/components/engagement/EngagementModelPage";

const SLUG = "offshore-development-center";

export const metadata = engagementModelMetadata(SLUG);

export default function OffshoreDevelopmentCenterPage() {
  return <EngagementModelPage model={requireEngagementModel(SLUG)} />;
}
