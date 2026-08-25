import type { ReactNode } from "react";
import SmoothScroll from "@/components/system/SmoothScroll";
import CustomCursor from "@/components/system/CustomCursor";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/system/Reveal";

/**
 * Shared page frame — Lenis smooth scroll, custom cursor, Navbar, Footer.
 * Extracted from the homepage (which used to inline all of this) so any
 * new real page (Contact, Services, Industries, ...) gets the exact same
 * shell without re-copying it. Footer stays a quiet zone: simple
 * fade-in, no cursor effects, same as it always was on the homepage.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
      <Reveal distance={0}>
        <Footer />
      </Reveal>
    </SmoothScroll>
  );
}
