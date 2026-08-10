"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useMotionAllowed } from "@/lib/motion";

type ParallaxTarget = {
  ref: RefObject<HTMLElement | null>;
  /** Fraction of cursor displacement applied as translate (0.05–0.08 for aurora) */
  strength?: number;
};

/**
 * Mouse parallax for the hero and AI-spotlight sections ONLY.
 * Heavily damped drift toward cursor + optional subtle 3D tilt.
 * Runs a single rAF loop per section; no-ops on touch / reduced motion.
 * Pauses when the container leaves the viewport (IntersectionObserver).
 */
export function useMouseParallax(
  containerRef: RefObject<HTMLElement | null>,
  targets: ParallaxTarget[]
) {
  const allowed = useMotionAllowed();
  const targetsRef = useRef(targets);
  targetsRef.current = targets;

  useEffect(() => {
    if (!allowed) return;
    const container = containerRef.current;
    if (!container) return;

    let mx = 0; // -0.5..0.5 relative to container center
    let my = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let running = false;

    const onMove = (e: globalThis.MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width - 0.5;
      my = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const tick = () => {
      cx += (mx - cx) * 0.06; // heavy damping
      cy += (my - cy) * 0.06;
      for (const t of targetsRef.current) {
        const el = t.ref.current;
        if (!el) continue;
        const s = (t.strength ?? 0.06) * 100; // % of container as px-ish drift
        // 2D translate only — 3D transforms create composited layers that can
        // break stacking against the fixed nav/scrim in some renderers.
        el.style.transform = `translate(${cx * s}px, ${cy * s}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      container.addEventListener("mousemove", onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      container.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(container);

    return () => {
      io.disconnect();
      stop();
    };
  }, [allowed, containerRef]);
}
