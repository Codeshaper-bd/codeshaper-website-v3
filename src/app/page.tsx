import SmoothScroll from "@/components/system/SmoothScroll";
import CustomCursor from "@/components/system/CustomCursor";
import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/hero/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import ServicePillars from "@/components/sections/ServicePillars";
import AboutStudio from "@/components/sections/AboutStudio";
import AiSpotlight from "@/components/sections/AiSpotlight";
import DeliverySystem from "@/components/sections/DeliverySystem";
import CaseStudies from "@/components/sections/CaseStudies";
import Industries from "@/components/sections/Industries";
import EngagementModels from "@/components/sections/EngagementModels";
import Testimonials from "@/components/sections/Testimonials";
import Locations from "@/components/sections/Locations";
import FinalCtaForm from "@/components/sections/FinalCtaForm";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/system/Reveal";

/**
 * PASS 2: motion layer active — Lenis smooth scroll, custom cursor
 * (desktop ≥1024px), shared reveal system, parallax (hero + AI spotlight
 * only), magnetic CTAs (hero + form only). No pinning anywhere.
 * Footer is a quiet zone: simple fade-in, no cursor effects.
 * Pass 3 (video media) still pending.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <CaseStudies />
        <AboutStudio />
        <ServicePillars />
        <EngagementModels />
        <Testimonials />
        <Industries />
        <AiSpotlight />
        <DeliverySystem />
        <Locations />
        <FinalCtaForm />
      </main>
      <Reveal distance={0}>
        <Footer />
      </Reveal>
    </SmoothScroll>
  );
}
