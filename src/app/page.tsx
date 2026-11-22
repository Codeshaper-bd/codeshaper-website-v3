// Below-the-fold sections load their code on approach (LazySection); the
// server still renders their full HTML.
import type { Metadata } from "next";
import LazySection, { type SectionName } from "@/components/system/LazySection";
import { mainMeta, mainPage } from "@/lib/mainPages";
import SiteShell from "@/components/system/SiteShell";
import Hero from "@/components/hero/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
// ServicePillars is the previous card-grid Services section — kept but
// unmounted below, pending a side-by-side decision against ServicesShowcase.
// import ServicePillars from "@/components/sections/ServicePillars";
// ServicesShowcase (tab list + detail panel) is the previous version, kept but unmounted.
// import ServicesShowcase from "@/components/sections/ServicesShowcase";
// import CaseStudiesExpand from "@/components/sections/CaseStudiesExpand";
// import AiDevExcellence from "@/components/sections/AiDevExcellence";

/**
 * PASS 2: motion layer active — Lenis smooth scroll, custom cursor
 * (desktop ≥1024px), shared reveal system, parallax (hero only),
 * magnetic CTAs (hero only). No pinning anywhere. Shell (SmoothScroll,
 * CustomCursor, Navbar, Footer) now lives in SiteShell so other real
 * pages (Contact, ...) share it instead of re-declaring it.
 *
 * AI Spotlight and Delivery System (including its "Standards that
 * reduce rework" block) were removed per direct request — that content
 * now lives only in the dedicated Services/How We Work pages.
 *
 * FinalCtaForm (the full contact-form section) was removed from the
 * homepage per direct request; that conversion path now lives at the
 * real /contact page, which every "Book a Call" link already points to.
 *
 * The order of the sections, and which ones show, is edited in the CMS
 * (Pages, Home). The hero is always first.
 */
const SECTIONS = ["servicesBento", "caseStudies", "industries", "humanAiFlow", "testimonials", "techStack", "impactWorkflow", "engagementModels", "aboutStudio", "faq"] satisfies SectionName[];
const isSection = (s: string): s is SectionName => (SECTIONS as string[]).includes(s);
const ORDER = mainPage("home").sections ?? ["trustStrip", ...SECTIONS.slice(0, 8)];

export const metadata: Metadata = mainMeta("home", {});

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      {ORDER.map((name) => (name === "trustStrip" ? <TrustStrip key={name} /> : isSection(name) ? <LazySection key={name} name={name} /> : null))}
    </SiteShell>
  );
}
