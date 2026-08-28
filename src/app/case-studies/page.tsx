import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import CaseStudyHero from "@/components/case-studies/CaseStudyHero";
import CaseStudyBrowser from "@/components/case-studies/CaseStudyBrowser";
import DeliveryModelsStrip from "@/components/case-studies/DeliveryModelsStrip";
import FeaturedTestimonial from "@/components/case-studies/FeaturedTestimonial";
import CaseStudiesFaq from "@/components/case-studies/CaseStudiesFaq";
import CaseStudiesFinalCta from "@/components/case-studies/CaseStudiesFinalCta";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { CASE_STUDIES_FAQ_JSON_LD } from "@/lib/caseStudiesFaq";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case Studies — Real Delivery, Measurable Outcomes",
  description:
    "See how CodeShaper designs, engineers, and automates digital products — with measurable outcomes, clean handover, and a predictable delivery cadence.",
  alternates: { canonical: "/case-studies" },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Case Studies", item: `${SITE_URL}/case-studies` },
  ],
};

export default function CaseStudiesPage() {
  return (
    <SiteShell>
      <div className="theme-light">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CASE_STUDIES_FAQ_JSON_LD) }} />

        <CaseStudyHero />
        <CaseStudyBrowser stories={CASE_STUDIES} />
        <DeliveryModelsStrip />
        <FeaturedTestimonial />
        <CaseStudiesFaq />
        <CaseStudiesFinalCta />
      </div>
    </SiteShell>
  );
}
