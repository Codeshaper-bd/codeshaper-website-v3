import type { ReactNode } from "react";
import SmoothScroll from "@/components/system/SmoothScroll";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/system/Reveal";
import LazyHydrate from "@/components/system/LazyHydrate";

/**
 * Shared page frame — Lenis smooth scroll, Navbar, Footer.
 * Extracted from the homepage (which used to inline all of this) so any
 * new real page (Contact, Services, Industries, ...) gets the exact same
 * shell without re-copying it. Footer stays a quiet zone: simple
 * fade-in, no cursor effects, same as it always was on the homepage.
 */
export default function SiteShell({ children, joinedFooter = false }: { children: ReactNode; joinedFooter?: boolean }) {
  return (
    <SmoothScroll>
      <Navbar />
      <main>{children}</main>
      {/* the footer is far below: hydrated on approach (LazyHydrate) */}
      <LazyHydrate>
        <Reveal distance={0}>
          <Footer joined={joinedFooter} />
        </Reveal>
      </LazyHydrate>
      {/* room for the fixed mobile tab bar (MobileTabBar) below the footer */}
      <div aria-hidden className="h-[calc(61px+env(safe-area-inset-bottom))] bg-light-surface lg:hidden" />
    </SmoothScroll>
  );
}
