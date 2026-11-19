"use client";

import { useEffect, useRef, useState } from "react";
import type { MarkHandle } from "./createMark";

type Status = "loading" | "ready" | "static";

/** Cursor cue copy: while the pieces are scattered, then once the mark is whole. */
const CUE_SHAPE = "Scroll to shape it";
const CUE_ENTER = "Keep scrolling to step inside";

/**
 * Hero intro ("Code to Shape"), ported from the Codeshaper Astro build and
 * scrubbed by GSAP ScrollTrigger while the hero is pinned (+180% of the
 * viewport):
 *
 *  1. Pieces: the nine pieces of the 3D Codeshaper mark float, large and
 *     scattered, in a soft lavender mist. They can be grabbed and thrown.
 *  2. Shape: scrolling locks them together into the mark (pearl → violet);
 *     the cursor bar blinks once it is whole.
 *  3. Hero: the mark sinks back and dissolves, the mist lifts, the flowing
 *     light and the globe come up, and the copy rises in. Unlike the source
 *     build, the mark does NOT fly into a badge above the headline.
 *
 * Runs only when the inline script in Hero.tsx set [data-hero][data-intro]
 * (desktop, fine pointer, WebGL, no reduced motion). Everyone else sees the
 * normal hero; any failure removes data-intro, so the content shows.
 * Focusing anything in the hero, or "Skip intro", jumps to the end.
 */
export default function HeroIntro() {
  const hostRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const host = hostRef.current;
    const root = host?.closest<HTMLElement>("[data-hero]");
    if (!host || !root || !root.hasAttribute("data-intro")) {
      setStatus("static");
      return;
    }

    let cancelled = false;
    let handle: MarkHandle | null = null;
    let cleanup: (() => void) | null = null;

    const giveUp = (why?: unknown) => {
      if (process.env.NODE_ENV !== "production") console.warn("[hero-intro] static fallback:", why);
      cleanup?.();
      cleanup = null;
      handle?.dispose();
      handle = null;
      root.removeAttribute("data-intro");
      root.removeAttribute("data-intro-live");
      if (!cancelled) setStatus("static");
    };

    let tipShown = false; // a piece is hovered: its label replaces the cursor cue
    const placeTip = (info: { label: string; x: number; y: number } | null) => {
      tipShown = !!info;
      const tip = tipRef.current;
      if (!tip) return;
      if (!info) {
        tip.style.opacity = "0";
        return;
      }
      tip.textContent = info.label;
      tip.style.transform = `translate(${info.x}px, ${info.y}px) translate(-50%, calc(-100% - 18px))`;
      tip.style.opacity = "1";
    };

    (async () => {
      try {
        const [{ createMark }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import("./createMark"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        // The safety timer in Hero.tsx may have cancelled the intro.
        if (cancelled || !hostRef.current || !root.hasAttribute("data-intro")) {
          if (!cancelled) setStatus("static");
          return;
        }
        gsap.registerPlugin(ScrollTrigger);
        const hero = root;
        const q = (sel: string) => [...(hero?.querySelectorAll<HTMLElement>(sel) ?? [])];
        const stage = hero?.querySelector<HTMLElement>("[data-hero-stage]");
        const column = hero?.querySelector<HTMLElement>("[data-hero-column]");
        if (!hero || !stage || !column) return giveUp("missing hero nodes");

        handle = createMark({
          host: hostRef.current,
          color: "#615fff",
          // the assembled mark: about a third of the card's height
          markHeight: (w, h) => Math.min(w * 0.2, h * 0.34),
          onReady: () => !cancelled && setStatus("ready"),
          onFail: () => giveUp("webgl"),
          onHover: placeTip,
        });

        const clamp = (v: number) => Math.min(1, Math.max(0, v));
        // The top bar is not part of the pinned card: it is hidden through
        // the intro (globals.css), fades in with the hero copy, and rides
        // along with the pinned card via --intro-shift (Navbar's top offset),
        // so after the pin it scrolls away with the hero as usual.
        const header = document.querySelector<HTMLElement>("[data-site-header]");
        let tl: gsap.core.Timeline | null = null;
        const shiftHeader = () => {
          const st = tl?.scrollTrigger;
          if (!st) return;
          const shift = Math.min(Math.max(window.scrollY - st.start, 0), st.end - st.start);
          document.documentElement.style.setProperty("--intro-shift", `${Math.round(shift)}px`);
        };
        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              handle?.setProgress(clamp(self.progress / 0.48));
              shiftHeader();
            },
            onRefresh: () => shiftHeader(),
          },
        });

        // Act 1: the figures arrive on their own (not on scroll) and count up.
        const chips = q("[data-intro-chip]");
        gsap.fromTo(chips, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, delay: 0.5, ease: "power3.out" });
        for (const el of q("[data-intro-count]")) {
          const target = Number(el.dataset.introCount);
          const suffix = el.dataset.introSuffix ?? "";
          const n = { v: 0 };
          gsap.to(n, {
            v: target,
            duration: 1.6,
            delay: 0.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(n.v)}${suffix}`;
            },
          });
        }
        // The intro row leaves as soon as the visitor starts shaping.
        tl.to(q("[data-hero-intro]"), { opacity: 0, y: 12, duration: 0.08 }, 0.1);
        // Act 3: the mark sinks back and dissolves, the mist lifts.
        tl.set(stage, { pointerEvents: "none" }, 0.56);
        tl.to(stage, { scale: 0.62, yPercent: -6, duration: 0.18, ease: "power2.in" }, 0.56);
        tl.to(stage, { opacity: 0, duration: 0.1 }, 0.64);
        tl.to(q("[data-hero-fog]"), { opacity: 0, duration: 0.16 }, 0.58);
        tl.fromTo(q("[data-hero-light]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 0.6);
        // The copy rises in, then the globe comes up from the bottom edge.
        tl.fromTo(
          q("[data-reveal]"),
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.03, ease: "power2.out" },
          0.66,
        );
        tl.fromTo(q("[data-reveal-globe]"), { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.72);
        if (header) tl.fromTo(header, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.74);
        tl.set(column, { pointerEvents: "auto" }, 0.8);
        tl.to({}, { duration: 0.04 }, 0.96);

        const trigger = tl.scrollTrigger!;
        const toEnd = () => window.scrollTo({ top: trigger.end + 1, behavior: "instant" });
        // Keyboard and screen reader users land on the finished hero.
        const onFocus = () => {
          if (trigger.progress < 0.95) toEnd();
        };
        column.addEventListener("focusin", onFocus);
        const skip = hero.querySelector<HTMLAnchorElement>("[data-hero-skip]");
        const onSkip = (e: Event) => {
          e.preventDefault();
          toEnd();
        };
        skip?.addEventListener("click", onSkip);

        // Cursor cue: "Scroll to shape it" rides beside the pointer (eased)
        // while the pieces are still scattered. It steps aside for a piece's
        // label or a drag, and leaves for good once shaping has begun.
        //
        // Custom cursor for the intro stage (replaces the system arrow there):
        //  · a small violet dot exactly at the pointer (no lag, so it never
        //    feels slow);
        //  · a glass ring that trails it slightly, carrying the cue pill;
        //  · over a piece the ring opens wide (grab me) and the pill steps
        //    aside for the piece's label; while dragging it tightens.
        // Off over the intro footer (its links keep the normal pointer) and
        // once the hero arrives, when the system cursor returns.
        const cue = cueRef.current;
        const dot = dotRef.current;
        const ring = cue?.querySelector<HTMLElement>("[data-cue-ring]");
        const pill = cue?.querySelector<HTMLElement>("[data-cue-pill]");
        const cueText = cue?.querySelector<HTMLElement>("[data-cue-text]");
        let cx = 0;
        let cy = 0;
        let tx = 0;
        let ty = 0;
        let inside = false;
        let overFooter = false;
        let pressed = false;
        let active = false;
        let cueRaf = 0;
        const stepCue = () => {
          cueRaf = 0;
          if (!cue || !dot || !ring || !pill) return;
          const pr = trigger.progress;
          const nowActive = inside && !overFooter && pr < 0.56;
          if (nowActive !== active) {
            active = nowActive;
            if (active) {
              cx = tx;
              cy = ty;
              root.setAttribute("data-cursor", "");
            } else root.removeAttribute("data-cursor");
            cue.style.opacity = dot.style.opacity = active ? "1" : "0";
          }
          // Two moments ask for a scroll: the scattered pieces, and the
          // finished mark (before it dissolves into the hero). Quiet while
          // the pieces are moving together.
          const label = pr < 0.04 ? CUE_SHAPE : pr > 0.4 ? CUE_ENTER : null;
          if (label && cueText && cueText.textContent !== label) cueText.textContent = label;
          const pillOn = active && !tipShown && !pressed && !!label;
          pill.style.opacity = pillOn ? "1" : "0";
          pill.style.translate = pillOn ? "0 -50%" : "-8px -50%";
          ring.style.scale = pressed ? "0.7" : tipShown ? "1.6" : "1";
          ring.style.backgroundColor = tipShown && !pressed ? "rgba(97,95,255,0.12)" : "";
          dot.style.scale = pressed ? "0.6" : "1";
          dot.style.translate = `${tx}px ${ty}px`;
          cx += (tx - cx) * 0.24;
          cy += (ty - cy) * 0.24;
          cue.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
          if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) cueRaf = requestAnimationFrame(stepCue);
        };
        const kickCue = () => {
          if (!cueRaf) cueRaf = requestAnimationFrame(stepCue);
        };
        const onPointer = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          const r = stage.getBoundingClientRect();
          tx = e.clientX - r.left;
          ty = e.clientY - r.top;
          inside = tx >= 0 && ty >= 0 && tx <= r.width && ty <= r.height;
          overFooter = !!(e.target as Element | null)?.closest?.("[data-hero-intro]");
          kickCue();
        };
        const onPress = (e: PointerEvent) => {
          pressed = e.type === "pointerdown";
          kickCue();
        };
        const onOut = () => {
          inside = false;
          kickCue();
        };
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPress, { passive: true });
        window.addEventListener("pointerup", onPress, { passive: true });
        window.addEventListener("scroll", kickCue, { passive: true });
        document.documentElement.addEventListener("pointerleave", onOut);

        root.setAttribute("data-intro-live", "");
        shiftHeader();
        cleanup = () => {
          cancelAnimationFrame(cueRaf);
          root.removeAttribute("data-cursor");
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("pointerdown", onPress);
          window.removeEventListener("pointerup", onPress);
          window.removeEventListener("scroll", kickCue);
          document.documentElement.removeEventListener("pointerleave", onOut);
          document.documentElement.style.removeProperty("--intro-shift");
          if (header) gsap.set(header, { clearProps: "all" });
          column.removeEventListener("focusin", onFocus);
          skip?.removeEventListener("click", onSkip);
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.killTweensOf(chips);
          gsap.set(
            [...q("[data-reveal]"), ...q("[data-reveal-globe]"), ...q("[data-hero-light]"), ...q("[data-hero-intro]"), ...q("[data-hero-fog]"), ...chips, stage, column],
            { clearProps: "all" },
          );
        };
      } catch (err) {
        giveUp(err);
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      cleanup = null;
      handle?.dispose();
      handle = null;
    };
  }, []);

  if (status === "static") return null;
  return (
    <div className="absolute inset-0" data-status={status}>
      <div
        ref={hostRef}
        className={`absolute inset-0 transition-opacity duration-700 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
      />
      {/* custom cursor (positioned by the effect): glass ring + cue pill, trailing */}
      <div
        ref={cueRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 transition-opacity duration-300 ease-out"
      >
        <span
          data-cue-ring
          className="absolute left-0 top-0 -ml-[18px] -mt-[18px] block h-9 w-9 rounded-full border border-white/90 bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_18px_-6px_rgba(60,50,140,0.35)] backdrop-blur-[3px] transition-[scale,background-color] duration-300 ease-out"
        />
        {/* frosted glass pill: blurred + saturated backdrop, a light top edge,
            a soft violet sheen and a floating shadow */}
        <span
          data-cue-pill
          className="absolute left-[30px] top-0 flex items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full border border-white/80 bg-white/35 py-[7px] pl-[7px] pr-3.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0b0f19] opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(97,95,255,0.08),0_10px_30px_-10px_rgba(60,50,140,0.35),0_2px_6px_-2px_rgba(11,15,25,0.08)] backdrop-blur-xl backdrop-saturate-[1.8] transition-[opacity,translate] duration-300 ease-out"
          style={{ translate: "-8px -50%" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.12) 38%, rgba(160,150,255,0.14) 70%, rgba(255,255,255,0.35) 100%)",
            }}
          />
          {/* mouse with a scrolling wheel, in a small violet glass chip */}
          <span className="relative grid h-[22px] w-[22px] place-items-center rounded-full bg-[#615fff]/12 ring-1 ring-[#615fff]/20">
            <span className="relative block h-[14px] w-[10px] rounded-full border-[1.5px] border-[#4f46e5]">
              <span className="intro-wheel absolute left-1/2 top-[2.5px] h-[3.5px] w-[1.5px] -translate-x-1/2 rounded-full bg-[#4f46e5]" />
            </span>
          </span>
          <span className="relative" data-cue-text>
            {CUE_SHAPE}
          </span>
        </span>
      </div>
      {/* cursor dot: exactly at the pointer */}
      <span
        ref={dotRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 transition-[opacity,scale] duration-200"
      >
        <span className="absolute -ml-[3.5px] -mt-[3.5px] block h-[7px] w-[7px] rounded-full bg-[#4f46e5] shadow-[0_0_0_2px_rgba(255,255,255,0.8)]" />
      </span>
      <span
        ref={tipRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap rounded-full bg-[#0b0f19] px-2.5 py-1 text-[12px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150"
      />
    </div>
  );
}
