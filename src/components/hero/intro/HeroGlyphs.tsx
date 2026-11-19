"use client";

import { useEffect, useRef } from "react";

/**
 * Faint code glyphs drifting upward behind the intro (ported from the
 * Codeshaper Astro build). Where the pointer moves they surface in a wave,
 * brighter and pushed aside, then settle. One decorative 2D canvas; the
 * pointer is read from the window so it never blocks anything. Runs
 * behind the hero and its intro; a still frame on touch, none under reduced
 * motion; pauses off screen and in hidden
 * tabs.
 */
const GLYPHS = ["{", "}", "<", ">", "/>", "</", "=>", ";", "()", "[]", "#", "&&", "::", "01", "fn", "=", "*", "$"];
const INK = "#0b0f19";
const BRAND = "#615fff";
const RADIUS = 150;

type Glyph = { x: number; y: number; vy: number; size: number; base: number; text: string; tint: string; ox: number; oy: number; glow: number; rot: number };

export default function HeroGlyphs() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const card = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !card || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // touch / no hover: one still frame (no drift, no pointer wave)
    const live = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let glyphs: Glyph[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    const trail: { x: number; y: number; t: number }[] = [];

    const seed = () => {
      const count = Math.round((w * h) / 11000);
      glyphs = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: 0.08 + Math.random() * 0.16,
        size: 12 + Math.random() * 7,
        base: 0.08 + Math.random() * 0.08,
        text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        tint: Math.random() < 0.55 ? BRAND : INK,
        ox: 0,
        oy: 0,
        glow: 0,
        rot: (Math.random() - 0.5) * 0.3,
      }));
    };
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const g of glyphs) {
        ctx.save();
        ctx.translate(g.x + g.ox, g.y + g.oy);
        ctx.rotate(g.rot);
        ctx.globalAlpha = Math.min(0.5, g.base + g.glow * 0.38);
        ctx.fillStyle = g.tint;
        ctx.font = `600 ${g.size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.fillText(g.text, 0, 0);
        ctx.restore();
      }
    };
    const resize = () => {
      const r = card.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      seed();
      draw();
    };

    let raf = 0;
    let visible = true;
    let disposed = false;
    const step = (now: number) => {
      raf = 0;
      while (trail.length && now - trail[0].t > 1100) trail.shift();
      for (const g of glyphs) {
        g.y -= g.vy;
        if (g.y < -20) {
          g.y = h + 20;
          g.x = Math.random() * w;
        }
        let boost = 0;
        let px = 0;
        let py = 0;
        for (const p of trail) {
          const dx = g.x - p.x;
          const dy = g.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS) {
            const k = (1 - d / RADIUS) ** 2 * (1 - (now - p.t) / 1100);
            boost = Math.max(boost, k);
            px += (dx / (d || 1)) * k;
            py += (dy / (d || 1)) * k;
          }
        }
        g.glow += (boost - g.glow) * 0.12;
        g.ox += (Math.max(-1, Math.min(1, px)) * 22 - g.ox) * 0.08;
        g.oy += (Math.max(-1, Math.min(1, py)) * 22 - g.oy) * 0.08;
      }
      draw();
      if (!disposed && visible && document.visibilityState === "visible") raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (live && !raf && !disposed) raf = requestAnimationFrame(step);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(card);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      trail.push({ x, y, t: performance.now() });
      if (trail.length > 24) trail.shift();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(card);
    document.addEventListener("visibilitychange", kick);
    kick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
