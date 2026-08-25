import SmoothScroll from "@/components/system/SmoothScroll";
import CustomCursor from "@/components/system/CustomCursor";
import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/hero/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import ServicePillars from "@/components/sections/ServicePillars";
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
import FinalCtaForm from "@/components/sections/FinalCtaForm";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/system/Reveal";

/**
 * PASS 2: motion layer active — Lenis smooth scroll, custom cursor
 * (desktop ≥1024px), shared reveal system, parallax (hero only),
 * magnetic CTAs (hero + form only). No pinning anywhere.
 * Footer is a quiet zone: simple fade-in, no cursor effects.
 * Pass 3 (video media) still pending.
 *
 * AI Spotlight and Delivery System (including its "Standards that
 * reduce rework" block) were removed per direct request — that content
 * now lives only in the dedicated Services/How We Work pages.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        {/* TRIAL: accordion-style Success Stories (hyperline.co reference) being evaluated against the version below */}
        <CaseStudiesExpand />
        {/* <CaseStudies /> */}
        <AboutStudio />
        <ServicePillars />
        <EngagementModels />
        <Testimonials />
        <Industries />
        <TechStack />
        <AiDevExcellence />
        <Locations />
        <FAQ />
        <FinalCtaForm />
      </main>
      <Reveal distance={0}>
        <Footer />
      </Reveal>
    </SmoothScroll>
  );
}
