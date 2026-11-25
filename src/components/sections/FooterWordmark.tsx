"use client";

import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import type gsapType from "gsap";

/** GSAP is loaded when the footer comes alive, not with the page (it was ~50 KB of the first load). */
let gsapPromise: Promise<typeof gsapType> | null = null;
const loadGsap = () => (gsapPromise ??= import("gsap").then((m) => m.default));
import { usePrefersReducedMotion } from "@/lib/motion";

const WORD = "CodeShaper";
const ACCENT = "#4D5CDE"; // sampled from the real logo mark (public/brand/logo.png)
/**
 * Owner, 25 Nov 2026: the wordmark stands in the footer landscape as a far
 * range behind the mountains (FooterLandscape renders it). Letters are filled
 * like the mountains: a lavender peak fading into the far-mountain haze at the
 * feet, where the hills cover them. Hover lights the peaks in the logo accent.
 */
/** one flat colour, a silhouette range (owner, 25 Nov 2026: gradients and rim looked busy); the landscape scene picks it */
const DAY_TONE = "#c3bbf6";
const FIT_PROBE_SIZE = 100; // px — arbitrary known base used to compute the fit ratio

/**
 * Footer wordmark, round 3 — now rendered in caps and JS-fit to exactly
 * 100% of its container's width (a `clamp()` font-size only ever
 * approximates full-bleed at whatever breakpoints it was tuned for; this
 * measures the actual rendered width at a known probe size and rescales
 * the font-size by the exact ratio, so it's edge-to-edge at any viewport
 * without distorting letter proportions — the same idea fitty.js/
 * react-textfit use). Re-measures via ResizeObserver on the wrapping
 * element, so it stays exact across breakpoint changes.
 *
 * Runs in useLayoutEffect (before paint) so there's no visible jump from
 * the CSS fallback size to the fitted one.
 *
 * Everything else is unchanged from round 2: a masked per-letter stagger
 * reveal on scroll into view, plus a magnetic hover (letters near the
 * cursor lift/scale/tint violet, falling off with distance) — see the
 * round-2 notes below for why IntersectionObserver instead of
 * ScrollTrigger, and the reduced-motion / failsafe handling.
 *
 * Round 4 fix: the entrance reveal needs `overflow: hidden` on the text
 * row to mask letters sliding up from below — but the hover-lift moves
 * letters ABOVE their resting position, and that same box was clipping
 * them (reported as the wordmark getting "cut off" on hover). Now the
 * reveal's `onComplete` (or immediately, under reduced motion) flips
 * `overflow` to visible once the mask is no longer needed.
 *
 * Round 5 fix: the hover/leave handlers reset un-influenced letters to
 * a hardcoded `BASE` hex that matched `--color-ink` in whichever theme
 * Footer happened to be in at the time this was written (dark). Once
 * Footer moved to `theme-light`, that constant would have kept resetting
 * hovered-then-released letters to the OLD dark theme's near-white ink
 * color — invisible on the new light background. Reads the real resolved
 * `text-ink` color from the container itself instead (cached in a ref
 * after the reveal-in mount), so it's automatically correct for whichever
 * theme this section is actually using, not whichever it used when this
 * was last touched.
 */
export default function FooterWordmark({ tone = DAY_TONE }: { tone?: string }) {
  const toneRef = useRef(tone);
  toneRef.current = tone;
  const gsapRef = useRef<typeof gsapType | null>(null);
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const baseColorRef = useRef("#000000");

  useLayoutEffect(() => {
    const el = containerRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    // Real resolved `text-ink` color for whichever theme this section is
    // actually in — see the round-5 note above for why this isn't a
    // hardcoded constant.
    baseColorRef.current = getComputedStyle(el).color;

    const fit = () => {
      const available = wrap.clientWidth;
      if (!available) return;
      el.style.fontSize = `${FIT_PROBE_SIZE}px`;
      const natural = el.scrollWidth;
      if (natural > 0) {
        el.style.fontSize = `${(available / natural) * FIT_PROBE_SIZE}px`;
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const letters = lettersRef.current.filter((el): el is HTMLSpanElement => Boolean(el));
    const container = containerRef.current;
    if (!letters.length || !container) return;
    let cancelled = false;
    let cleanup = () => {};
    void loadGsap().then((gsap) => {
      if (cancelled) return;
      gsapRef.current = gsap;
      cleanup = run(gsap);
    });
    const run = (gsap: typeof gsapType) => {

    // overflow-hidden only exists to mask the entrance slide-up; once
    // revealed it has to come off, or the hover-lift (translateY negative,
    // moving letters ABOVE their resting position) gets clipped by that
    // same box — this was cutting letters off on hover.
    const unmask = () => {
      container.style.overflow = "visible";
    };

    if (reduced) {
      gsap.set(letters, { yPercent: 0, opacity: 1, rotate: 0 });
      unmask();
      return () => {};
    }

    gsap.set(letters, { yPercent: 100, opacity: 0, rotate: 6 });

    const reveal = () => {
      gsap.to(letters, {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.035,
        onComplete: unmask,
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        io.disconnect();
        clearTimeout(failsafe);
      },
      { threshold: 0.3 }
    );
    io.observe(container);
    const failsafe = setTimeout(() => {
      reveal();
      io.disconnect();
    }, 2000);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
    };
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced]);

  const handleMove = (e: MouseEvent<HTMLParagraphElement>) => {
    const gsap = gsapRef.current;
    if (reduced || !containerRef.current || !gsap) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    lettersRef.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.left - containerRect.left + r.width / 2;
      const influence = Math.max(0, 1 - Math.abs(mouseX - center) / 220);
      gsap.to(el, {
        y: -influence * 18,
        scale: 1 + influence * 0.12,
        "--wm-top": influence > 0.15 ? ACCENT : toneRef.current,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const handleLeave = () => {
    const gsap = gsapRef.current;
    if (reduced || !gsap) return;
    const letters = lettersRef.current.filter((el): el is HTMLSpanElement => Boolean(el));
    gsap.to(letters, { y: 0, scale: 1, "--wm-top": toneRef.current, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };

  return (
    <div ref={wrapRef} className="w-full">
      <p
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        role="img"
        aria-label="CodeShaper"
        className="m-0 inline-flex select-none overflow-hidden whitespace-nowrap font-urbanist text-[clamp(3rem,15vw,11rem)] font-black uppercase leading-[0.85] tracking-tighter text-ink"
      >
        {WORD.split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden
            ref={(el) => {
              lettersRef.current[i] = el;
            }}
            className="inline-block bg-clip-text text-transparent [-webkit-background-clip:text]"
            style={
              {
                "--wm-top": tone,
                backgroundImage: `linear-gradient(180deg, var(--wm-top) 0%, ${tone} 55%, ${tone} 100%)`,
              } as React.CSSProperties
            }
          >
            {ch}
          </span>
        ))}
      </p>
    </div>
  );
}
