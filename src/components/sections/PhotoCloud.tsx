"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * A cloud of floating photos that can be picked up and thrown (mouse, pen
 * or touch). A thrown photo glides with its release speed, slows, then
 * springs back to its place. Each photo also floats gently on its own rhythm
 * (CSS .wf-float on the inner layer, so drag and float never fight).
 *
 * `tint` renders inside each photo above the image (the colour overlay that
 * cycles with the section's glow). Under reduced motion photos stay put.
 */
export type CloudPhoto = { src: string; alt: string; x: number; y: number; w: number; r: string };

type Body = { x: number; y: number; vx: number; vy: number; dragging: boolean; px: number; py: number; t: number };

export default function PhotoCloud({ photos, tint, className = "" }: { photos: CloudPhoto[]; tint: (i: number) => React.ReactNode; className?: string }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>(photos.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, px: 0, py: 0, t: 0 })));
  const raf = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let moving = false;
      bodies.current.forEach((b, i) => {
        if (!b.dragging) {
          // spring home (critically-ish damped) + glide
          b.vx += -b.x * 22 * dt;
          b.vy += -b.y * 22 * dt;
          b.vx *= Math.exp(-5.5 * dt);
          b.vy *= Math.exp(-5.5 * dt);
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (Math.abs(b.x) < 0.2 && Math.abs(b.y) < 0.2 && Math.hypot(b.vx, b.vy) < 2) {
            b.x = b.y = b.vx = b.vy = 0;
          } else moving = true;
        } else moving = true;
        const el = refs.current[i];
        if (el) {
          const tilt = Math.max(-14, Math.min(14, b.vx * 0.02));
          el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
          el.style.zIndex = b.dragging || Math.abs(b.x) + Math.abs(b.y) > 2 ? "20" : "";
        }
      });
      raf.current = moving ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf.current) {
        last = performance.now();
        raf.current = requestAnimationFrame(step);
      }
    };

    const cleanups = refs.current.map((el, i) => {
      if (!el) return () => {};
      const b = bodies.current[i];
      const down = (e: PointerEvent) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        b.dragging = true;
        b.px = e.clientX;
        b.py = e.clientY;
        b.t = performance.now();
        b.vx = b.vy = 0;
        el.style.cursor = "grabbing";
        kick();
      };
      const move = (e: PointerEvent) => {
        if (!b.dragging) return;
        const now = performance.now();
        const dx = e.clientX - b.px;
        const dy = e.clientY - b.py;
        const dts = Math.max(0.008, (now - b.t) / 1000);
        b.x += dx;
        b.y += dy;
        b.vx = dx / dts;
        b.vy = dy / dts;
        b.px = e.clientX;
        b.py = e.clientY;
        b.t = now;
      };
      const up = (e: PointerEvent) => {
        if (!b.dragging) return;
        b.dragging = false;
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        // cap the throw so photos stay roughly in view
        const sp = Math.hypot(b.vx, b.vy);
        if (sp > 2600) {
          b.vx *= 2600 / sp;
          b.vy *= 2600 / sp;
        }
        el.style.cursor = "";
        kick();
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      return () => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      };
    });
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {photos.map((ph, i) => (
        <div
          key={ph.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute cursor-grab touch-none select-none"
          style={{ left: `${ph.x}%`, top: `${ph.y}%`, width: `${ph.w}%` } as CSSProperties}
        >
          <div
            className="wf-float relative overflow-hidden rounded-[18px] shadow-[0_18px_40px_-18px_rgba(40,30,110,0.5)] ring-1 ring-white/60"
            style={{ aspectRatio: ph.r, animationDelay: `${i * -1.9}s`, animationDuration: `${9 + (i % 3) * 2}s` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative, lazy */}
            <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" draggable={false} className="pointer-events-none h-full w-full object-cover" />
            {tint(i)}
          </div>
        </div>
      ))}
    </div>
  );
}
