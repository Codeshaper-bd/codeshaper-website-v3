"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { drawGradientMesh } from "./gradientMesh";

/**
 * Full-bleed animated gradient-mesh background for the light hero.
 *
 * Replaces the dark aurora video (HeroVideo): same "always-on ambient
 * motion" role, but a canvas-drawn indigo/teal mesh instead of a video
 * loop — reads correctly on a white background and drops the external
 * CDN dependency entirely.
 *
 * Reduced motion: a single static frame is drawn once, no rAF loop.
 */
export default function HeroMesh() {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const t0 = performance.now();
    const draw = () => {
      resize();
      drawGradientMesh(ctx, canvas.width, canvas.height, performance.now() - t0);
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduced) {
      drawGradientMesh(ctx, canvas.width, canvas.height, 0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
