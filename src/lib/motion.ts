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
