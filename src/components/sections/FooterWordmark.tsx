"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

const WORD = "codeshaper";
const ACCENT = "#7c6cff";
const BASE = "#f5f4f2"; // matches --color-ink in the dark (unthemed) scope Footer lives in

/**
 * Footer wordmark, round 2 — was static text, now a per-letter GSAP piece:
 * a masked stagger reveal (letters slide up from behind overflow-hidden)
 * the first time it scrolls into view, plus a magnetic hover — letters
 * near the cursor lift, scale, and tint toward the violet accent, falling
 * off with distance. Mouse-driven, so it's a desktop-only flourish; touch
 * devices just get the entrance.
 *
 * IntersectionObserver (not GSAP ScrollTrigger — this project doesn't use
 * that plugin anywhere, consistent with "no pinning" elsewhere) drives the
 * reveal, with the same two safety nets Reveal.tsx uses: reduced-motion
 * renders the final state immediately instead of skipping setup outright
 * (so a `reduced` flip mid-mount can't leave letters stuck invisible), and
 * a timeout failsafe in case the observer never fires.
 */
export default function FooterWordmark() {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const letters = lettersRef.current.filter((el): el is HTMLSpanElement => Boolean(el));
    if (!letters.length) return;

    if (reduced) {
      gsap.set(letters, { yPercent: 0, opacity: 1, rotate: 0 });
      return;
    }

    gsap.set(letters, { yPercent: 100, opacity: 0, rotate: 6 });

    const reveal = () => {
      gsap.to(letters, { yPercent: 0, opacity: 1, rotate: 0, duration: 0.9, ease: "power4.out", stagger: 0.035 });
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
    if (containerRef.current) io.observe(containerRef.current);
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
    <p
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label="codeshaper"
      className="m-0 flex select-none overflow-hidden whitespace-nowrap font-urbanist text-[clamp(3rem,15vw,11rem)] font-black leading-[0.85] tracking-tighter text-ink"
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
  );
}
