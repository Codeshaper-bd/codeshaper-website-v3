import SiteShell from "@/components/system/SiteShell";
import Hero from "@/components/hero/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
// ServicePillars is the previous card-grid Services section — kept but
// unmounted below, pending a side-by-side decision against ServicesShowcase.
// import ServicePillars from "@/components/sections/ServicePillars";
import ServicesShowcase from "@/components/sections/ServicesShowcase";
import AboutStudio from "@/components/sections/AboutStudio";
import CaseStudies from "@/components/sections/CaseStudies";
import CaseStudiesExpand from "@/components/sections/CaseStudiesExpand";
import Industries from "@/components/sections/Industries";
import TechStack from "@/components/sections/TechStack";
import AiDevExcellence from "@/components/sections/AiDevExcellence";
import EngagementModels from "@/components/sections/EngagementModels";
import Testimonials from "@/components/sections/Testimonials";
import Locations from "@/components/sections/Locations";
import FAQ from "@/components/sections/FAQ";

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
      <ServicesShowcase />
      <AiDevExcellence />
      <Industries />
      <EngagementModels />
      {/* TRIAL: accordion-style Case Studies (hyperline.co reference) being evaluated against the version below */}
      <CaseStudiesExpand />
      {/* <CaseStudies /> */}
      <Testimonials />
      <TechStack />
      <AboutStudio />
      <Locations />
      <FAQ />
    </SiteShell>
  );
}
