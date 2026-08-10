"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

type Props = {
  /** Lines of the headline; each line staggers in */
  lines: string[];
  className?: string;
};

/**
 * Kinetic "scramble settle" headline:
 * renders each line twice — a scrambled ghost layer offset above that
 * resolves character-by-character while the real line masks up into place.
 * (Mechanic referenced from produx.design's hero; styling/copy our own.)
 * Reduced motion: plain static headline.
 */
export default function ScrambleHeadline({ lines, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  const [ghosts, setGhosts] = useState<string[]>(lines.map((l) => l));
  const [settled, setSettled] = useState(reduced);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setSettled(true);
      return;
    }
    if (started.current) return;
    started.current = true;

    const DURATION = 900;
    const STAGGER = 140;
    const t0 = performance.now();
    let raf = 0;

    const step = (now: number) => {
      let allDone = true;
      const next = lines.map((line, li) => {
        const local = now - t0 - li * STAGGER;
        const p = Math.min(1, Math.max(0, local / DURATION));
        if (p < 1) allDone = false;
        const settleCount = Math.floor(p * line.length);
        return line
          .split("")
          .map((ch, ci) => {
            if (ch === " ") return " ";
            if (ci < settleCount) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
      });
      setGhosts(next);
      if (!allDone) {
        raf = requestAnimationFrame(step);
      } else {
        setGhosts(lines);
        setSettled(true);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [lines, reduced]);

  if (reduced) {
    return (
      <h1 className={className}>
        {lines.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <h1 className={className} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} className="relative block overflow-hidden" aria-hidden>
          {/* ghost duplicate — offset above, fades as it settles */}
          <span
            className="absolute left-0 top-0 block select-none text-ink-faint transition-all duration-700 ease-out"
            style={{
              transform: settled ? "translateY(-0.35em)" : "translateY(-0.18em)",
              opacity: settled ? 0 : 0.35,
              transitionDelay: `${i * 140}ms`,
            }}
          >
            {ghosts[i]}
          </span>
          {/* real line — masks up into place */}
          <span
            className="block transition-transform duration-700"
            style={{
              transform: settled ? "translateY(0)" : "translateY(110%)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: `${i * 140}ms`,
            }}
          >
            {ghosts[i]}
          </span>
        </span>
      ))}
    </h1>
  );
}
