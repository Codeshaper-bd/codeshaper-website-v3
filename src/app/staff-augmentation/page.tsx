import EngagementModelPage, { engagementModelMetadata, requireEngagementModel } from "@/components/engagement/EngagementModelPage";

const SLUG = "staff-augmentation";

export const metadata = engagementModelMetadata(SLUG);

export default function StaffAugmentationPage() {
  return <EngagementModelPage model={requireEngagementModel(SLUG)} />;
}
