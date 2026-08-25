"use client";

import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

const WORD = "codeshaper";
const ACCENT = "#7c6cff";
const BASE = "#f5f4f2"; // matches --color-ink in the dark (unthemed) scope Footer lives in
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
 */
export default function FooterWordmark() {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

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
      return;
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
  }, [reduced]);

  const handleMove = (e: MouseEvent<HTMLParagraphElement>) => {
    if (reduced || !containerRef.current) return;
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
        color: influence > 0.15 ? ACCENT : BASE,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const handleLeave = () => {
    if (reduced) return;
    const letters = lettersRef.current.filter((el): el is HTMLSpanElement => Boolean(el));
    gsap.to(letters, { y: 0, scale: 1, color: BASE, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };

  return (
    <div ref={wrapRef} className="w-full">
      <p
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        aria-label="codeshaper"
        className="m-0 inline-flex select-none overflow-hidden whitespace-nowrap font-urbanist text-[clamp(3rem,15vw,11rem)] font-black uppercase leading-[0.85] tracking-tighter text-ink"
      >
        {WORD.split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden
            ref={(el) => {
              lettersRef.current[i] = el;
            }}
            className="inline-block"
          >
            {ch}
          </span>
        ))}
      </p>
    </div>
  );
}
