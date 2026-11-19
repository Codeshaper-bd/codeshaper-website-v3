"use client";

import { useEffect, useRef, useState } from "react";
import type { MarkHandle } from "./createMark";

type Status = "loading" | "ready" | "static";

/** Cursor cue copy: while the pieces are scattered, then once the mark is whole. */
const CUE_SHAPE = "Scroll to shape it";
const CUE_ENTER = "Keep scrolling to step inside";

/**
 * Hero intro ("Code to Shape"), ported from the Codeshaper Astro build and
 * scrubbed by GSAP ScrollTrigger while the hero is pinned (+250% of the
 * viewport):
 *
 *  1. Pieces: the nine pieces of the 3D Codeshaper mark float, large and
 *     scattered, in a soft lavender mist. They can be grabbed and thrown.
 *  2. Shape, then connect: scrolling locks them together into the mark
 *     (pearl → violet) while drifting dust gathers into two halftone hands,
 *     Human from the left and AI from the right (createHands.ts), reaching
 *     under the mark and lock into a handshake as you scroll.
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
    let disposeHands: (() => void) | null = null;

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
        const [{ createMark }, { createHands, handColours }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import("./createMark"),
          import("./createHands"),
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
          // same geometry as the hands (createHands.ts): a 1200 x 700 "meet"
          // box with the mark ~220 units across, so the clasp sits under it
          markHeight: (w, h) => Math.min((w * 220) / 1200, (h * 220) / 700) * 0.92,
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
            end: "+=250%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              handle?.setProgress(clamp(self.progress / 0.33));
              handle?.setCalm(clamp((self.progress - 0.54) / 0.06));
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
        // Act 2: dust gathers into two hands, Human from the left and AI from
        // the right, reaching for each other under the mark; a caption names
        // them, and the grip glows softly as they lock.
        const handsCanvas = hero.querySelector<HTMLCanvasElement>("[data-hero-hands]");
        const hands = handsCanvas ? createHands(handsCanvas, { ...handColours(), animate: true }) : null;
        hands?.set(0);
        disposeHands = () => hands?.dispose();
        const handState = { t: 0 };
        const drive = () => hands?.set(handState.t);
        const caption = q("[data-hand-label]");
        // the hands gather while the mark forms and clasp soon after it is
        // whole, so the logo and the handshake complete together
        tl.to(handState, { t: 1, duration: 0.22, onUpdate: drive }, 0.2);
        tl.fromTo(caption, { opacity: 0 }, { opacity: 1, duration: 0.06, stagger: 0.02 }, 0.36);
        tl.to(caption, { opacity: 0, duration: 0.05 }, 0.56);
        // Act 3: as soon as scrolling resumes after the handshake, the hands
        // dissolve upward while the mark lifts off and arcs up into the
        // header, where it becomes the logo; the glass nav arrives meanwhile.
        tl.to(handState, { t: 2, duration: 0.12, onUpdate: drive }, 0.56);
        const headerMark = header?.querySelector<HTMLElement>("[data-header-mark]") ?? null;
        const ring = header?.querySelector<HTMLElement>("[data-header-ring]") ?? null;
        const card = stage.parentElement!;
        /** From the card centre (the 3D mark) to the header's mark slot. Layout
         *  boxes only (the card is never scaled), so it is right at any scroll. */
        const flight = () => {
          if (!headerMark) return { x: 0, y: -card.clientHeight * 0.06, scale: 0.62 };
          const c = card.getBoundingClientRect();
          const m = headerMark.getBoundingClientRect();
          const markPx = Math.min((c.width * 220) / 1200, (c.height * 220) / 700) * 0.92;
          return {
            x: m.left + m.width / 2 - (c.left + c.width / 2),
            y: m.top + m.height / 2 - (c.top + c.height / 2),
            // the 3D mark fits 72 units into markPx; the SVG fits 64 into its box
            scale: (m.height * 72) / 64 / markPx,
          };
        };
        tl.set(stage, { pointerEvents: "none" }, 0.56);
        // An arc, not a straight line: it rises first (y eases out) and then
        // glides across (x eases in and out), shrinking as it goes.
        tl.to(stage, { y: () => flight().y, duration: 0.16, ease: "power2.out" }, 0.56);
        tl.to(stage, { x: () => flight().x, duration: 0.16, ease: "sine.inOut" }, 0.56);
        tl.to(stage, { scale: () => flight().scale, duration: 0.16, ease: "power2.inOut" }, 0.56);
        tl.fromTo(q("[data-hero-light]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.64);
        // The copy rises in, then the globe comes up from the bottom edge.
        tl.fromTo(
          q("[data-reveal]"),
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.028, ease: "power2.out" },
          0.76,
        );
        tl.fromTo(q("[data-reveal-globe]"), { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.8);
        // the top bar arrives while the mark is in flight (no slide, so the
        // landing slot stays put), its own mark hidden until the 3D one lands
        // The top bar is shown as a container; each part arrives on its own:
        // the glass capsule slides in at the right, its links one by one
        // (left to right), "Book a Call" last, the wordmark beside the slot,
        // all done as the mark lands.
        const capsule = header?.querySelector<HTMLElement>("[data-nav-capsule]") ?? null;
        const navItems = capsule ? [...capsule.querySelectorAll<HTMLElement>("nav > div > ul > li")] : [];
        const cta = header?.querySelector<HTMLElement>("[data-nav-cta]") ?? null;
        const wordmark = header?.querySelector<HTMLElement>("[data-nav-wordmark]") ?? null;
        if (header) tl.fromTo(header, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.58);
        // (clearProps: no transform may stay on an ancestor of the fixed mega
        // panels, or they would position against it instead of the viewport)
        // once the logo has landed, the links and "Book a Call" appear,
        // left to right
        if (navItems.length)
          tl.fromTo(
            navItems,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.035, stagger: 0.01, ease: "power2.out", clearProps: "transform" },
            0.745,
          );
        if (cta) tl.fromTo(cta, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.035, ease: "power2.out", clearProps: "transform" }, 0.785);
        // the wordmark slides out from beside the logo once it has landed
        // (earlier, the mark would fly across it)
        if (wordmark)
          tl.fromTo(wordmark, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.05, ease: "power2.out", clearProps: "transform" }, 0.716);
        // the landing: the flat logo takes over, one soft ring ripples out
        if (headerMark) tl.fromTo(headerMark, { opacity: 0 }, { opacity: 1, duration: 0.012 }, 0.714);
        tl.to(stage, { opacity: 0, duration: 0.012 }, 0.72);
        if (ring) tl.fromTo(ring, { opacity: 0.6, scale: 0.7 }, { opacity: 0, scale: 2.1, duration: 0.06, ease: "power2.out" }, 0.72);
        tl.set(column, { pointerEvents: "auto" }, 0.86);
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
        // The pointer itself stays the SYSTEM cursor: the OS draws it, so it
        // never lags, however busy the page is (the 3D mark, the hands and the
        // glyphs all render each frame here). A custom cursor drawn by the
        // page can only move once per finished frame, which felt laggy.
        // Off over the intro footer and once the hero arrives.
        const cue = cueRef.current;
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
          if (!cue || !pill) return;
          const pr = trigger.progress;
          const nowActive = inside && !overFooter && pr < 0.56;
          if (nowActive !== active) {
            active = nowActive;
            if (active) {
              cx = tx;
              cy = ty;
            }
            cue.style.opacity = active ? "1" : "0";
          }
          // Two moments ask for a scroll: the scattered pieces, and the
          // finished mark (before it dissolves into the hero). Quiet while
          // the pieces are moving together.
          const label = pr < 0.04 ? CUE_SHAPE : pr > 0.34 ? CUE_ENTER : null;
          if (label && cueText && cueText.textContent !== label) cueText.textContent = label;
          const pillOn = active && !tipShown && !pressed && !!label;
          pill.style.opacity = pillOn ? "1" : "0";
          pill.style.translate = pillOn ? "0 0" : "-6px 0";
          cx += (tx - cx) * 0.35;
          cy += (ty - cy) * 0.35;
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
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("pointerdown", onPress);
          window.removeEventListener("pointerup", onPress);
          window.removeEventListener("scroll", kickCue);
          document.documentElement.removeEventListener("pointerleave", onOut);
          document.documentElement.style.removeProperty("--intro-shift");
          if (header) gsap.set(header, { clearProps: "all" });
          if (headerMark) gsap.set(headerMark, { clearProps: "all" });
          gsap.set([capsule, cta, wordmark, ...navItems].filter(Boolean), { clearProps: "all" });
          if (ring) gsap.set(ring, { clearProps: "all" });
          column.removeEventListener("focusin", onFocus);
          skip?.removeEventListener("click", onSkip);
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.killTweensOf(chips);
          gsap.set(
            [...q("[data-hand-label]"), ...q("[data-reveal]"), ...q("[data-reveal-globe]"), ...q("[data-hero-light]"), ...q("[data-hero-intro]"), ...q("[data-hero-fog]"), ...chips, stage, column],
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
      disposeHands?.();
      disposeHands = null;
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
      {/* cue pill beside the system cursor (positioned by the effect, trailing slightly) */}
      <div
        ref={cueRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 transition-opacity duration-300 ease-out"
      >
        {/* frosted glass pill: a light top edge, a soft violet sheen and a
            floating shadow; a modest backdrop blur (a moving blur over the 3D
            canvas is costly, so it stays small) */}
        <span
          data-cue-pill
          className="absolute left-[18px] top-[22px] flex items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full border border-white/80 bg-white/60 py-[7px] pl-[7px] pr-3.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0b0f19] opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(97,95,255,0.08),0_10px_30px_-10px_rgba(60,50,140,0.35),0_2px_6px_-2px_rgba(11,15,25,0.08)] backdrop-blur-[6px] transition-[opacity,translate] duration-300 ease-out"
          style={{ translate: "-6px 0" }}
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
      <span
        ref={tipRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap rounded-full bg-[#0b0f19] px-2.5 py-1 text-[12px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150"
      />
    </div>
  );
}
