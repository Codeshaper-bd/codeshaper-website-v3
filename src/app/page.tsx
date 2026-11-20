// Below-the-fold sections load their code on approach (LazySection); the
// server still renders their full HTML.
import LazySection from "@/components/system/LazySection";
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
 * Section order (audit pass): moved from
 * Hero → TrustStrip → CaseStudies → About → Services → Engagement →
 * Testimonials → Industries → TechStack → AiDev → Locations → FAQ
 * to
 * Hero → TrustStrip → Services → AiDev → Industries → Engagement →
 * CaseStudies → Testimonials → TechStack → About → Locations → FAQ.
 * Reasoning: a cold organic-search visitor needs "what do you do" and
 * "who's it for" before "proof you can do it" and "who you are as a
 * studio" — the previous order showed case studies and company story
 * before the visitor knew what CodeShaper actually offers.
 */
export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <TrustStrip />
      {/* <ServicePillars /> */}
      {/* <ServicesShowcase /> */}
      <LazySection name="servicesBento" />
      {/* <AiDevExcellence /> */}
      {/* Case Studies (owner request: swapped up from below Industries, where
          Human + AI now sits) */}
      {/* TRIAL: accordion-style Case Studies (hyperline.co reference) being evaluated against this version */}
      {/* <CaseStudiesExpand /> */}
      <LazySection name="caseStudies" />
      <LazySection name="industries" />
      <LazySection name="humanAiFlow" />
      {/* <CaseStudies /> */}
      <LazySection name="testimonials" />
      <LazySection name="techStack" />
      {/* numbers + AI and human workflow (where Tech Stack was) */}
      <LazySection name="impactWorkflow" />
      {/* Engagement Models (swapped with Tech Stack) */}
      <LazySection name="engagementModels" />
      {/* hidden for now (owner): Who we are / Why teams choose us / glimpses, and FAQ */}
      {/* <LazySection name="aboutStudio" /> */}
      {/* <LazySection name="faq" /> */}
      {/* Locations hidden for now (owner) */}
      {/* <LazyHydrate><Locations /></LazyHydrate> */}
    </SiteShell>
  );
}
