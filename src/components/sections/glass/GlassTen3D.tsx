"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

/**
 * Background layer of "Our journey": a real-time glass "10" (createGlassTen.ts)
 * drawn over the section's soft wash, placed on the empty stage `slot` the
 * section leaves for it (measured live, so it follows the layout at every
 * width). three.js loads only here, after mount. Decorative: hidden from
 * assistive tech.
 *
 * Without WebGL (switched off, blocked by the browser after a GPU crash, or
 * lost again and again), a frosted CSS "10" stands in the same slot, so the
 * section never shows an empty stage (owner, 25 Nov 2026: "the 10 is missing").
 */
const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

export default function GlassTen3D({ value, slot }: { value: string; slot: RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // a lost WebGL context (too many in the tab, or a GPU reset) that does not come back: start again on a fresh canvas
  const [gen, setGen] = useState(0);

  useEffect(() => {
    const el = canvas.current;
    if (!el || failed) return;
    if (!hasWebGL()) {
      setFailed(true);
      return;
    }
    let alive = true;
    let handle: { dispose: () => void; ok?: boolean } | null = null;
    let retry = 0;
    const onLost = () => {
      setReady(false);
      retry = window.setTimeout(() => {
        if (!alive) return;
        if (gen < 3) setGen((g) => g + 1);
        else setFailed(true);
      }, 1500);
    };
    const onRestored = () => {
      clearTimeout(retry);
      setReady(true);
    };
    el.addEventListener("webglcontextlost", onLost);
    el.addEventListener("webglcontextrestored", onRestored);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // the slot's centre and height, as fractions of the canvas
    const anchor = () => {
      const c = el.getBoundingClientRect();
      const s = slot.current?.getBoundingClientRect();
      if (!s || !c.width || !c.height) return { x: 0.75, y: 0.4, height: 0.45 };
      return { x: (s.left + s.width / 2 - c.left) / c.width, y: (s.top + s.height / 2 - c.top) / c.height, height: (s.height * 0.62) / c.height };
    };
    import("./createGlassTen")
      .then(({ createGlassTen }) => {
        if (!alive) return;
        handle = createGlassTen({ canvas: el, value, anchor, reducedMotion: reduced, dragTarget: slot.current });
        if (handle.ok === false) {
          setFailed(true);
          return;
        }
        requestAnimationFrame(() => alive && setReady(true));
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      clearTimeout(retry);
      // our own clean-up loses the context on purpose: stop listening first
      el.removeEventListener("webglcontextlost", onLost);
      el.removeEventListener("webglcontextrestored", onRestored);
      handle?.dispose();
    };
  }, [value, slot, gen, failed]);

  if (failed) return slot.current ? createPortal(<CssTen value={value} />, slot.current) : null;
  return <canvas key={gen} ref={canvas} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />;
}

/** The stand-in: the same figure as frosted lavender glass, in CSS only. */
function CssTen({ value }: { value: string }) {
  return (
    <span aria-hidden className="pointer-events-none flex h-full w-full items-center justify-center">
      <span
        className="font-display font-extrabold leading-none tracking-[-0.06em] [font-size:clamp(9rem,22vw,21rem)]"
        style={{
          color: "transparent",
          backgroundImage: "linear-gradient(160deg, #ffffff 0%, #e9e5ff 35%, #c9c2f6 62%, #ffd9c7 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          filter: "drop-shadow(0 24px 40px rgba(79,70,229,0.18)) drop-shadow(0 2px 0 rgba(255,255,255,0.9))",
        }}
      >
        {value}
      </span>
    </span>
  );
}
