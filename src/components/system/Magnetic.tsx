"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionAllowed } from "@/lib/motion";

/**
 * Magnetic wrapper: pulls its child toward the cursor whenever the pointer is
 * within ~24px of the element's bounds (listens on window, so the pull starts
 * *before* the cursor is over the button), then springs back on exit.
 * Transform-only. Inert on touch / reduced motion.
 * Sitewide budget: hero "Book a Call", header "Book a Call", form CTAs.
 */
const RADIUS = 24;
const MAX_PULL = 24;

export default function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const allowed = useMotionAllowed();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!allowed) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let active = false;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const inZone =
        e.clientX >= r.left - RADIUS &&
        e.clientX <= r.right + RADIUS &&
        e.clientY >= r.top - RADIUS &&
        e.clientY <= r.bottom + RADIUS;

      if (inZone) {
        active = true;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const px = Math.max(-MAX_PULL, Math.min(MAX_PULL, dx * 0.3));
        const py = Math.max(-MAX_PULL, Math.min(MAX_PULL, dy * 0.4));
        inner.style.transition = "transform 90ms ease-out";
        inner.style.transform = `translate(${px}px, ${py}px)`;
      } else if (active) {
        active = false;
        inner.style.transition = "transform 420ms cubic-bezier(0.34,1.56,0.64,1)";
        inner.style.transform = "translate(0, 0)";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [allowed]);

  return (
    <span ref={wrapRef} className={`inline-block ${className}`}>
      <span
        ref={innerRef}
        className={`will-change-transform ${className ? "block" : "inline-block"}`}
      >
        {children}
      </span>
    </span>
  );
}
