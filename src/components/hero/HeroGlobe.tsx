"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { PALETTES, paletteDelay } from "./heroPalette";
import type { GlobeHandle } from "./globe/createGlobe";

/**
 * Hero globe slot: the upper cap of a pearl globe, cropped by the hero's
 * bottom edge.
 *
 * Layers (back → front), all in one reserved box so nothing shifts:
 *  1. Atmosphere: one CSS glow ring per gradient palette, using the hero's own
 *     `.hg-layer` keyframes and delays (heroPalette.ts). Same clock as the
 *     background, no second colour cycle, no JS per frame. Under reduced
 *     motion `.hg-layer` freezes on the first palette.
 *  2. Static globe image (/media/hero-globe.webp, captured from the live
 *     render). Shown first, and permanently on touch devices, under reduced
 *     motion, without WebGL, or if anything fails.
 *  3. Live WebGL globe (three.js, dynamically imported once the slot nears
 *     the viewport and the browser is idle). Fades in over the identical
 *     image; renders only while being dragged or reset.
 *
 * Interaction (live mode, mouse/pen only): drag inside the sphere to rotate;
 * no zoom, wheel capture, pan, inertia or auto-rotation. Touch never starts
 * a drag (touch-action: pan-y), so page scrolling always works. "Reset view"
 * appears only after the globe has been turned.
 *
 * Geometry is pure CSS from one variable (--gd, the sphere diameter), so the
 * box is reserved during SSR and matches createGlobe's FRAME/Y0 contract.
 *
 * Dev only: append ?globe=off to compare the gradient-only composition.
 */
const SPHERE_URL = "/media/hero-globe.webp";
const LAND_URL = "/media/globe-land.webp";

type Mode = "static" | "live" | "off";

/** Cheap capability probe; the throwaway context is released immediately. */
function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export default function HeroGlobe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GlobeHandle | null>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [live, setLive] = useState(false);
  const [rotated, setRotated] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).get("globe") === "off") {
      setMode("off");
      return;
    }
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // Interactive only where a precise pointer exists; everyone else gets the
    // identical static image (and never downloads three.js).
    if (reduced || !finePointer || window.innerWidth < 768) return;
    // No WebGL at all? Keep the static image and skip downloading three.js.
    if (!hasWebGL()) return;

    let cancelled = false;
    let idle = 0;
    const start = () => {
      import("./globe/createGlobe")
        .then(({ createGlobe }) => {
          if (cancelled || !stageRef.current) return;
          handleRef.current = createGlobe({
            host: stageRef.current,
            textureUrl: LAND_URL,
            reducedMotion: reduced,
            onReady: () => !cancelled && setLive(true),
            onRotatedChange: (v) => !cancelled && setRotated(v),
            onFail: (reason) => {
              if (process.env.NODE_ENV !== "production") console.warn("[hero-globe] static fallback:", reason);
              handleRef.current?.dispose();
              handleRef.current = null;
              if (!cancelled) {
                setLive(false);
                setRotated(false);
              }
            },
          });
          setMode("live");
        })
        .catch(() => {
          /* chunk failed to load: the static image simply stays */
        });
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
          .requestIdleCallback;
        idle = ric ? ric(start, { timeout: 1500 }) : window.setTimeout(start, 300);
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(stage);

    return () => {
      cancelled = true;
      io.disconnect();
      const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cic) cic(idle);
      clearTimeout(idle);
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  if (mode === "off") {
    // gradient-only composition (dev comparison): the light below the content, as before
    return <div aria-hidden className="h-[clamp(80px,18vh,160px)] lg:h-[clamp(118px,21vh,198px)]" />;
  }

  return (
    <div className="pointer-events-none relative w-full @container">
      <div className="relative h-[calc(var(--gd)*0.46)] w-full [--gd:min(92cqw,420px)] sm:[--gd:clamp(300px,min(56cqw,62svh),760px)]">
        <div
          ref={stageRef}
          className="absolute bottom-0 left-1/2 h-full w-[calc(var(--gd)*1.16)] -translate-x-1/2"
        >
          {/* 1 · atmosphere, synced to the hero gradient */}
          <div aria-hidden className="absolute inset-x-0 top-[calc(var(--gd)*-0.02)] aspect-square">
            {PALETTES.map((p, i) => (
              <div
                key={p.name}
                className="hg-layer"
                style={{
                  background: `radial-gradient(circle closest-side, rgba(${p.accent},0) 80%, rgba(${p.accent},0.4) 86.3%, rgba(${p.accent},0.16) 91%, rgba(${p.accent},0) 100%)`,
                  animationDelay: paletteDelay(i),
                }}
              />
            ))}
          </div>

          {/* 2 · static globe (also the loading state and every fallback) */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative, sized by CSS */}
          <img
            src={SPHERE_URL}
            alt=""
            aria-hidden
            decoding="async"
            loading="lazy"
            fetchPriority="low"
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${live ? "opacity-0" : "opacity-100"}`}
          />

          {/* 3 · live canvas is appended here by createGlobe (it alone takes pointer events) */}
        </div>

        {mode === "live" && live && rotated && (
          <button
            type="button"
            onClick={() => handleRef.current?.reset()}
            className="pointer-events-auto absolute bottom-5 right-[max(16px,calc(50%-var(--gd)*0.62))] inline-flex h-9 items-center gap-1.5 rounded-full border border-[#0b0f19]/10 bg-white/85 px-3.5 text-[13px] font-semibold text-[#0b0f19] backdrop-blur-sm transition-colors hover:bg-white active:scale-[0.97]"
          >
            <RotateCcw size={14} strokeWidth={2} aria-hidden />
            Reset view
          </button>
        )}
      </div>
    </div>
  );
}
