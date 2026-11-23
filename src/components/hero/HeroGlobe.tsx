"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { PALETTES, paletteDelay } from "./heroPalette";
import type { GlobeHandle, HoverInfo, LabelPos, PinInfo } from "./globe/createGlobe";
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
 * Floating sales labels (live mode). Countries with a known count, biggest
 * first; that order is also the priority when two labels would overlap.
 * Each label is a glass pill on a hairline stem, anchored to a dot on the
 * country. While the globe turns, a label:
 *  · fades in as its country turns to face the viewer and out toward the
 *    edge (facing hysteresis, so nothing flickers at the threshold);
 *  · shrinks slightly with depth, so the front of the globe reads closest;
 *  · gives way to a bigger country's label instead of overlapping it;
 *  · steps aside for the tooltip while its country is hovered.
 * At most MAX_LABELS show at once, so the globe never becomes a word cloud.
 */
const LABELED = SERVED.filter((c) => c.count).sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
const MAX_LABELS = 6;
const STEM = 14; // px from the surface dot to the pill
const PILL_H = 26;
const SHOW_AT = 0.42; // facing needed to appear…
const KEEP_AT = 0.3; // …and to stay
const nf = new Intl.NumberFormat("en-US");
const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function placeLabels(
  els: (HTMLElement | null)[],
  widths: number[],
  shown: boolean[],
  pos: LabelPos[] | null,
  hovered: string | null,
  stageW: number,
  stageH: number,
  pin: PinInfo | null = null
) {
  const taken: { l: number; r: number; t: number; b: number }[] = [];
  // the HQ pin (and its hover label) keeps its own space
  if (pin?.visible) taken.push({ l: pin.x - 16, r: pin.x + 16, t: pin.y - 34, b: pin.y + 6 });
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    if (!el) continue;
    const lp = pos?.[i];
    let show = false;
    let scale = 1;
    if (lp && LABELED[i].a3 !== hovered && taken.length < MAX_LABELS + (pin?.visible ? 1 : 0)) {
      const inView = lp.y > 8 && lp.y < stageH - 10 && lp.x > 0 && lp.x < stageW;
      if (inView && lp.facing > (shown[i] ? KEEP_AT : SHOW_AT)) {
        scale = 0.86 + 0.14 * smooth(0.3, 0.95, lp.facing);
        if (!widths[i]) widths[i] = el.querySelector<HTMLElement>("[data-pill]")?.offsetWidth ?? 120;
        const w = widths[i] * scale;
        const box = {
          l: lp.x - w / 2 - 4,
          r: lp.x + w / 2 + 4,
          t: lp.y - (STEM + PILL_H) * scale - 4,
          b: lp.y + 4,
        };
        if (!taken.some((o) => box.l < o.r && box.r > o.l && box.t < o.b && box.b > o.t)) {
          taken.push(box);
          show = true;
        }
      }
    }
    shown[i] = show;
    if (lp) el.style.transform = `translate3d(${lp.x}px, ${lp.y}px, 0) scale(${scale.toFixed(3)})`;
    el.style.opacity = show && lp ? smooth(KEEP_AT, 0.6, lp.facing).toFixed(3) : "0";
  }
}

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

/** priority: the hero's copy is the page's largest element; load it eagerly. */
export default function HeroGlobe({ priority = false }: { priority?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GlobeHandle | null>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [live, setLive] = useState(false);
  const [rotated, setRotated] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const labelState = useRef({ widths: [] as number[], shown: [] as boolean[], hovered: null as string | null, last: null as LabelPos[] | null, pin: null as PinInfo | null });

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
            labels: LABELED,
            onLabels: (pos) => {
              const st = labelState.current;
              st.last = pos;
              const stage = stageRef.current;
              if (stage) placeLabels(labelEls.current, st.widths, st.shown, pos, st.hovered, stage.clientWidth, stage.clientHeight, st.pin);
            },
            onHover: (info) => {
              placeTip(tipRef.current, info);
              const st = labelState.current;
              const a3 = info?.a3 ?? null;
              if (a3 === st.hovered) return;
              st.hovered = a3;
              const stage = stageRef.current;
              if (stage && st.last) placeLabels(labelEls.current, st.widths, st.shown, st.last, a3, stage.clientWidth, stage.clientHeight, st.pin);
            },
            onPin: (pin) => {
              labelState.current.pin = pin;
              placePin(pinRef.current, pin);
            },
            reducedMotion: reduced,
            onReady: () => !cancelled && setLive(true),
            onRotatedChange: (v) => !cancelled && setRotated(v),
            onFail: (reason) => {
              if (process.env.NODE_ENV !== "production") console.warn("[hero-globe] static fallback:", reason);
              handleRef.current?.dispose();
              handleRef.current = null;
              placeTip(tipRef.current, null);
              placePin(pinRef.current, null);
              labelState.current.last = null;
              placeLabels(labelEls.current, labelState.current.widths, labelState.current.shown, null, null, 0, 0);
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
    // The live globe (three.js + WebGL) waits for the visitor's first
    // interaction; until then the identical still image shows. Keeps the
    // first load light (it is the page's largest element and its heaviest
    // script), and real visitors move the mouse almost at once.
    const EVENTS = ["pointermove", "pointerdown", "wheel", "scroll", "keydown", "touchstart"] as const;
    const arm = () => {
      EVENTS.forEach((ev) => window.removeEventListener(ev, arm));
      if (!cancelled) io.observe(stage);
    };
    EVENTS.forEach((ev) => window.addEventListener(ev, arm, { passive: true, once: true }));

    return () => {
      EVENTS.forEach((ev) => window.removeEventListener(ev, arm));
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
            // smaller copies for smaller screens (the globe is ~490px wide on phones)
            srcSet={`/media/hero-globe-900.webp 900w, /media/hero-globe-1200.webp 1200w, ${SPHERE_URL} 1800w`}
            sizes="(min-width: 1024px) 880px, (min-width: 640px) 75vw, 490px"
            alt=""
            aria-hidden
            decoding={priority ? "sync" : "async"}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "low"}
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${live ? "opacity-0" : "opacity-100"}`}
          />

          {/* 3 · live canvas is appended here by createGlobe (it alone takes pointer events) */}

          {/* 4 · floating sales labels (live mode; positioned by placeLabels) */}
          {LABELED.map((c, i) => (
            <div
              key={c.a3}
              ref={(el) => {
                labelEls.current[i] = el;
              }}
              aria-hidden
              className="absolute left-0 top-0 z-[5] origin-[0_0] opacity-0 transition-opacity duration-300 ease-out will-change-transform"
            >
              {/* surface dot */}
              <span className="absolute left-0 top-0 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white bg-[#615fff] shadow-[0_0_0_3px_rgba(97,95,255,0.18)]" />
              {/* stem */}
              <span
                className="absolute bottom-[3px] left-0 w-px -translate-x-1/2 bg-gradient-to-t from-[#615fff]/60 to-[#615fff]/0"
                style={{ height: STEM - 3 }}
              />
              {/* pill */}
              <span
                data-pill
                className="absolute left-0 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/90 bg-white/70 px-2.5 text-[11.5px] leading-none text-[#0b0f19] shadow-[0_6px_18px_-8px_rgba(11,15,25,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md"
                style={{ bottom: STEM, height: PILL_H }}
              >
                <span className="font-medium">{c.name}</span>
                <span className="h-3 w-px bg-[#0b0f19]/12" />
                <span className="font-semibold tabular-nums text-[#4f46e5]">{nf.format(c.count ?? 0)}</span>
                <span className="-ml-0.5 text-[#0b0f19]/55">{c.count === 1 ? COUNT_LABEL.one : COUNT_LABEL.many}</span>
              </span>
            </div>
          ))}

          {/* 5 · HQ pin: follows the globe in live mode; fixed spot on the static image */}
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

          {/* 6 · country tooltip (live mode, mouse only) */}
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
