"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { PALETTES, paletteDelay } from "./heroPalette";
import type { GlobeHandle, HoverInfo, PinInfo } from "./globe/createGlobe";
import { SERVED, COUNT_LABEL, HQ } from "./globe/servedCountries";

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
const IDS_URL = "/media/globe-countries.png";
/** HQ pin position in the static image, as fractions of the stage (measured from the live render at the base orientation). */
const STATIC_PIN = { fx: 0.6883, fy: 0.6891, visible: true };

type Mode = "static" | "live" | "off";

/**
 * Pin and tooltip are moved by writing styles directly (no React state):
 * the pin follows the globe on every drag frame.
 */
function placePin(el: HTMLElement | null, pin: PinInfo | null) {
  if (!el) return;
  const visible = pin ? pin.visible : STATIC_PIN.visible;
  el.style.left = pin ? `${pin.x}px` : `${STATIC_PIN.fx * 100}%`;
  el.style.top = pin ? `${pin.y}px` : `${STATIC_PIN.fy * 100}%`;
  el.style.opacity = visible ? "1" : "0";
  el.style.pointerEvents = visible ? "auto" : "none";
}
function placeTip(el: HTMLElement | null, info: HoverInfo | null) {
  if (!el) return;
  if (!info) {
    el.style.opacity = "0";
    return;
  }
  const name = el.querySelector<HTMLElement>("[data-name]");
  const detail = el.querySelector<HTMLElement>("[data-detail]");
  if (name) name.textContent = info.name;
  if (detail) {
    detail.textContent = info.detail ?? "";
  }
  el.style.transform = `translate(${info.x}px, ${info.y}px) translate(-50%, calc(-100% - 14px))`;
  el.style.opacity = "1";
}

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
  const pinRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

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
            landUrl: LAND_URL,
            idsUrl: IDS_URL,
            served: SERVED,
            countLabel: COUNT_LABEL,
            hq: HQ,
            onHover: (info) => placeTip(tipRef.current, info),
            onPin: (pin) => placePin(pinRef.current, pin),
            reducedMotion: reduced,
            onReady: () => !cancelled && setLive(true),
            onRotatedChange: (v) => !cancelled && setRotated(v),
            onFail: (reason) => {
              if (process.env.NODE_ENV !== "production") console.warn("[hero-globe] static fallback:", reason);
              handleRef.current?.dispose();
              handleRef.current = null;
              placeTip(tipRef.current, null);
              placePin(pinRef.current, null);
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

          {/* 4 · HQ pin: follows the globe in live mode; fixed spot on the static image */}
          <div
            ref={pinRef}
            role="img"
            aria-label={`${HQ.detail}: ${HQ.label}`}
            className="group/pin absolute z-10 -translate-x-1/2 -translate-y-full transition-opacity duration-300"
            style={{
              left: `${STATIC_PIN.fx * 100}%`,
              top: `${STATIC_PIN.fy * 100}%`,
              opacity: STATIC_PIN.visible ? 1 : 0,
              pointerEvents: STATIC_PIN.visible ? "auto" : "none",
            }}
          >
            <span aria-hidden className="absolute bottom-[-3px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#615fff]/40 motion-safe:animate-ping" />
            <span aria-hidden className="relative block h-[22px] w-[22px] -rotate-45 rounded-full rounded-bl-none border-2 border-white bg-[#615fff] shadow-[0_3px_8px_rgba(97,95,255,0.45)]">
              <span className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0b0f19] px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/pin:opacity-100"
            >
              {HQ.label}
              <span className="text-white/70"> · {HQ.detail}</span>
            </span>
          </div>

          {/* 5 · country tooltip (live mode, mouse only) */}
          <div
            ref={tipRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap rounded-[10px] bg-[#0b0f19] px-3 py-2 text-white opacity-0 shadow-[0_8px_24px_-6px_rgba(11,15,25,0.45)] transition-opacity duration-150"
          >
            <span data-name className="block text-[13px] font-semibold leading-tight" />
            <span data-detail className="mt-0.5 block text-[11.5px] leading-tight text-white/70" />
            <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-[#0b0f19]" />
          </div>
        </div>

        {/* the globe's information, for everyone (hover is mouse-only) */}
        <p className="sr-only">
          We have worked with clients in {SERVED.length} countries, including {SERVED.map((s) => (s.count ? `${s.name} (${s.count} ${s.count === 1 ? COUNT_LABEL.one : COUNT_LABEL.many})` : s.name)).join(", ")}. Our
          headquarters is in {HQ.label}.
        </p>

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
