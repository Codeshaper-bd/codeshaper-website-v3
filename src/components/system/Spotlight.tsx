"use client";

import { useRef, type ReactNode, type MouseEvent, type ElementType } from "react";
import { useMotionAllowed } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** CSS color for the radial spotlight center */
  color?: string;
  /** Spotlight radius in px */
  radius?: number;
};

/**
 * Spotlight hover container — radial gradient follows the cursor,
 * clipped to this element's bounds only. Used on service index rows,
 * case-study cards, and mega-menu columns.
 * Writes CSS vars; the overlay itself only animates opacity.
 */
export default function Spotlight({
  children,
  className = "",
  as: Tag = "div",
  color = "rgba(139, 92, 246, 0.14)",
  radius = 320,
}: Props) {
  const allowed = useMotionAllowed();
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = (e: MouseEvent) => {
    if (!allowed || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={allowed ? onMouseMove : undefined}
      className={`group/spot relative overflow-hidden ${className}`}
    >
      {allowed && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
          style={{
            background: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 70%)`,
          }}
        />
      )}
      {children}
    </Tag>
  );
}
