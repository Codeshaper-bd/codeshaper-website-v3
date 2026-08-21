"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Decorative concentric rings bleeding off the hero's bottom-left corner —
 * an original (not traced) equivalent of the reference site's looping
 * background video, built from plain divs since perfect circles carry no
 * information under rotation. GSAP staggers a scale+opacity breathe across
 * the rings so it reads as a slow pulse radiating outward, not a static
 * decoration.
 *
 * Reduced motion: rings render at rest, no pulse loop.
 */
const RING_SIZES = [420, 660, 900, 1140, 1380];

export default function HeroRings() {
  const reduced = usePrefersReducedMotion();
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const els = ringRefs.current.filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.to(els, {
        scale: 1.035,
        opacity: (i: number) => 0.16 - i * 0.026,
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.35, from: "start" },
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -bottom-[35%] -left-[25%] h-[1380px] w-[1380px]">
        {RING_SIZES.map((size, i) => (
          <div
            key={size}
            ref={(el) => {
              ringRefs.current[i] = el;
            }}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `calc(50% - ${size / 2}px)`,
              top: `calc(50% - ${size / 2}px)`,
              border: "1.5px solid rgba(9,9,11,0.1)",
              opacity: 0.16 - i * 0.026,
            }}
          />
        ))}
      </div>
    </div>
  );
}
