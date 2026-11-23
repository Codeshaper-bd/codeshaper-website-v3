"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scroll wired into GSAP ScrollTrigger. Disabled for reduced
 * motion and on touch screens (phones scroll natively; this saves ~60 KB). Lenis and GSAP (~70 KB) are loaded after the page has painted, on
 * the visitor's first scroll/pointer/key or at idle time, so they never sit
 * in the first load. Until then the browser's native scrolling works as usual.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // touch screens scroll natively (Lenis leaves touch alone anyway): don't download it there
    if (reduced || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    let cancelled = false;
    let teardown: (() => void) | null = null;

    const start = async () => {
      const [{ default: LenisCtor }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      // the hero intro moves the scroll position when it retires its pin
      (window as Window & { __lenis?: Lenis }).__lenis = lenis;
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      teardown = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        delete (window as Window & { __lenis?: Lenis }).__lenis;
      };
    };

    const EVENTS = ["wheel", "touchstart", "pointerdown", "keydown", "scroll"] as const;
    let fired = false;
    const go = () => {
      if (fired) return;
      fired = true;
      EVENTS.forEach((ev) => window.removeEventListener(ev, go));
      void start();
    };
    EVENTS.forEach((ev) => window.addEventListener(ev, go, { passive: true }));
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const usedRic = !!ric;
    const idle = ric ? ric(go, { timeout: 4000 }) : window.setTimeout(go, 2500);

    return () => {
      cancelled = true;
      EVENTS.forEach((ev) => window.removeEventListener(ev, go));
      const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (usedRic && cic) cic(idle);
      else window.clearTimeout(idle);
      teardown?.();
    };
  }, [reduced]);

  return <>{children}</>;
}
