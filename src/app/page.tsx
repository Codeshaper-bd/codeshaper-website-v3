// Below-the-fold sections load their code on approach (LazySection); the
// server still renders their full HTML.
import type { Metadata } from "next";
import { mainMeta, mainPage } from "@/lib/mainPages";
import HomeView, { type HomeData } from "@/components/home/HomeView";
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
 * The sections, their order and their words are edited in the CMS
 * (Pages, Home) and drawn by components/home/HomeView. The hero is
 * always first.
 */
export const metadata: Metadata = mainMeta("home", { alternates: { canonical: "/" } });

export default function Home() {
  return <HomeView data={mainPage("home") as HomeData} />;
}
