import SiteShell from "@/components/system/SiteShell";
import DetailPage from "@/components/system/DetailPage";
import DetailSections from "@/components/cms/DetailSections";
import { INDUSTRIES, slugFromHref, type IndustryLink } from "@/lib/navigation";
import { industryDetail, type Detail } from "@/lib/details";

export default function IndustryPage({ industry: ind, detail = industryDetail(slugFromHref(ind.href)) }: { industry: IndustryLink; detail?: Detail }) {
  return (
    <SiteShell>
      <DetailPage
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: ind.label }]}
        icon={ind.icon}
        eyebrow="Industries"
        title={detail.headline ?? ind.label}
        intro={ind.summary}
        facts={[ind.outcome, ...ind.systems]}
        ctaLabel="Talk about your industry"
        relatedTitle="Other industries"
        related={INDUSTRIES.filter((i) => i.href !== ind.href)
          .slice(0, 4)
          .map((i) => ({ title: i.label, description: i.desc, href: i.href, icon: i.icon }))}
      >
        <DetailSections detail={detail} name={ind.label} first />
      </DetailPage>
    </SiteShell>
  );
}
