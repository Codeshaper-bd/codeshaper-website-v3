"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Background layer of "Our journey": a real-time glass "10" (createGlassTen.ts)
 * drawn over the section's soft wash, placed on the empty stage `slot` the
 * section leaves for it (measured live, so it follows the layout at every
 * width). three.js loads only here, after mount; until then, and without
 * WebGL, the CSS wash underneath shows. Decorative: hidden from assistive tech.
 */
export default function GlassTen3D({ value, slot }: { value: string; slot: RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let alive = true;
    let handle: { dispose: () => void } | null = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // the slot's centre and height, as fractions of the canvas
    const anchor = () => {
      const c = el.getBoundingClientRect();
      const s = slot.current?.getBoundingClientRect();
      if (!s || !c.width || !c.height) return { x: 0.75, y: 0.4, height: 0.45 };
      return { x: (s.left + s.width / 2 - c.left) / c.width, y: (s.top + s.height / 2 - c.top) / c.height, height: (s.height * 0.62) / c.height };
    };
    import("./createGlassTen").then(({ createGlassTen }) => {
      if (!alive) return;
      handle = createGlassTen({ canvas: el, value, anchor, reducedMotion: reduced, dragTarget: slot.current });
      requestAnimationFrame(() => alive && setReady(true));
    });
    return () => {
      alive = false;
      handle?.dispose();
    };
  }, [value, slot]);

  return <canvas ref={canvas} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />;
}
