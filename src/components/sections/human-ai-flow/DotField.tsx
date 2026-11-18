"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Dotted-grid background on a canvas.
 *  · Mouse: dots around the cursor grow and tint violet, with soft rings
 *    rippling outward from it (a "wave" that follows the pointer).
 *  · `pulse(x, y)`: one ring that travels across the grid from a point
 *    (page coordinates), used when the flow hands work to a new step.
 * Draws once and sleeps when nothing is moving; the rAF loop only runs
 * while the cursor is over it or a pulse is travelling. Reduced motion:
 * static dots only.
 */
export type DotFieldHandle = { pulse: (clientX: number, clientY: number) => void };

const GAP = 20;
const BASE = { r: 0.9, a: 0.13 };
const ACCENT = [91, 79, 214]; // #5b4fd6
const HOVER_R = 170;

const DotField = forwardRef<DotFieldHandle, { className?: string }>(function DotField({ className = "" }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<DotFieldHandle>({ pulse: () => {} });
  useImperativeHandle(ref, () => ({ pulse: (x, y) => api.current.pulse(x, y) }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999, inside: false, k: 0 }; // k: eased hover strength 0..1
    const pulses: { x: number; y: number; t0: number }[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    function draw(now: number) {
      ctx!.clearRect(0, 0, w, h);
      const t = now / 1000;
      const live = pulses.filter((p) => now - p.t0 < 1800);
      pulses.length = 0;
      pulses.push(...live);
      const ox = (w % GAP) / 2 + GAP / 2;
      const oy = (h % GAP) / 2 + GAP / 2;
      for (let y = oy; y < h; y += GAP) {
        for (let x = ox; x < w; x += GAP) {
          let e = 0; // 0..1 energy of this dot
          if (mouse.k > 0.01) {
            const d = Math.hypot(x - mouse.x, y - mouse.y);
            if (d < HOVER_R) {
              const fall = 1 - d / HOVER_R;
              const wave = 0.55 + 0.45 * Math.sin(d / 13 - t * 5); // rings moving outward
              e = Math.max(e, fall * fall * wave * mouse.k);
            }
          }
          for (const p of pulses) {
            const age = (now - p.t0) / 1800; // 0..1
            const radius = age * 620;
            const d = Math.hypot(x - p.x, y - p.y);
            const band = 1 - Math.min(1, Math.abs(d - radius) / 38);
            if (band > 0) e = Math.max(e, band * (1 - age) * 0.9);
          }
          const r = BASE.r + e * 1.9;
          const a = BASE.a + e * 0.7;
          ctx!.fillStyle =
            e > 0.02 ? `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${a})` : `rgba(11,15,25,${BASE.a})`;
          ctx!.beginPath();
          ctx!.arc(x, y, r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    const tick = (now: number) => {
      mouse.k += ((mouse.inside ? 1 : 0) - mouse.k) * 0.08;
      draw(now);
      if (mouse.k > 0.01 || pulses.length) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const wake = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(tick);
    };

    // listen on the parent so content above the canvas still drives it
    const host = canvas.parentElement!;
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      mouse.x = ev.clientX - r.left;
      mouse.y = ev.clientY - r.top;
      mouse.inside = true;
      wake();
    };
    const onLeave = () => {
      mouse.inside = false;
      wake();
    };
    api.current.pulse = (cx, cy) => {
      if (reduced) return;
      const r = canvas.getBoundingClientRect();
      pulses.push({ x: cx - r.left, y: cy - r.top, t0: performance.now() });
      wake();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (!reduced) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }
    return () => {
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
});

export default DotField;
