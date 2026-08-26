"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Slide distance in px (transform-only animation) */
  distance?: number;
};

/**
 * Scroll-reveal: fade + slide-up when the element enters the viewport.
 * Plain IntersectionObserver — NO ScrollTrigger pinning anywhere (v3 §0).
 * Reduced motion: renders visible immediately, no animation.
 */
export default function Reveal({ children, className = "", delay = 0, distance = 28 }: Props) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    // Safety net: content must NEVER stay hidden if the observer misfires
    // (e.g. print, snapshot renderers, odd embed contexts).
    const failsafe = setTimeout(() => setShown(true), 1500);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={className}
      data-shown={shown}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity 600ms var(--ease-out-expo) ${delay}ms, transform 600ms var(--ease-out-expo) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
