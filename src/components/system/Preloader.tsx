"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * One-time boot splash — lives in the root layout (not per-page SiteShell),
 * so it mounts exactly once per hard page load and never remounts on
 * client-side navigation (App Router layouts persist across route changes;
 * only the page segment below them swaps). That's also why no sessionStorage
 * gate is needed: the component simply isn't in the tree again until a real
 * reload.
 *
 * Rendered visible by default (no client-only mount gate) so the very first
 * server-rendered paint already shows the covering panel — a client-only
 * "if (!mounted) return null" would let the real page flash underneath for
 * one frame before hydration.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }

    const hex = hexRef.current;
    const logo = logoRef.current;
    const bar = barRef.current;
    const root = rootRef.current;
    if (!hex || !logo || !bar || !root) return;

    const length = hex.getTotalLength();
    gsap.set(hex, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(logo, { opacity: 0, y: 10 });

    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    });

    tl.to(hex, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" })
      .to(logo, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.35)
      .to(bar, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0.5)
      .to([hex.closest("svg"), logo, bar], { opacity: 0, duration: 0.3, ease: "power1.in" }, "+=0.25")
      .to(root, { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "-=0.05");

    return () => {
      tl.kill();
    };
  }, [reduced]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#0a0a0f]"
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-[#8a7bff]">
        <path
          ref={hexRef}
          d="M32 4 L57 18 L57 46 L32 60 L7 46 L7 18 Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {/* Footer's own comment explains why: the raster logo.png bakes in a
          dark wordmark that can't sit on a dark surface — a live text span
          (matching Footer's exact "codeShaper" recreation) adapts instead. */}
      <div ref={logoRef} className="flex items-center">
        <span className="font-urbanist text-xl font-bold tracking-tight text-white">codeShaper</span>
      </div>
      <div className="h-[2px] w-32 overflow-hidden rounded-full bg-white/10">
        <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-[#8a7bff]" />
      </div>
    </div>
  );
}
