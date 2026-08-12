"use client";

import { useEffect, useState } from "react";

/** True when the user prefers reduced motion. SSR-safe (false on server). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** True on desktop-class devices: fine pointer AND ≥1024px (Pass 2 §2.2). SSR-safe. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

/** Combined guard: cursor-follow / parallax layers should run only when this is true. */
export function useMotionAllowed(): boolean {
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  return fine && !reduced;
}

/**
 * Shared fade + rise entrance style: opacity 0→1, translateY 18px→0.
 * Used by every staggered hero element (headline sub-parts, CTAs, proof
 * bar, product-card scene) so entrance timing stays visually consistent
 * across files without duplicating the transition string.
 */
export function seqStyle(on: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  };
}
