"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { useMotionAllowed } from "@/lib/motion";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

/**
 * Magnetic CTA — reserved for genuine calls-to-action only.
 * Pulls toward cursor within its bounds (+~24px), springs back on leave.
 * Transform-only animation; inert on touch / reduced-motion.
 */
export default function MagneticButton({ href, children, className = "", glow = false }: Props) {
  const allowed = useMotionAllowed();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const onMouseMove = (e: MouseEvent) => {
    if (!allowed || !wrapRef.current || !innerRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    // Cap pull to ~24px in either axis
    const px = Math.max(-24, Math.min(24, dx * 0.28));
    const py = Math.max(-24, Math.min(24, dy * 0.28));
    innerRef.current.style.transition = "transform 80ms ease-out";
    innerRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
  };

  const onMouseLeave = () => {
    if (!innerRef.current) return;
    innerRef.current.style.transition = "transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    innerRef.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block p-2 -m-2"
    >
      <span ref={innerRef} className="inline-block will-change-transform">
        <Link
          href={href}
          className={`inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-display text-sm font-medium tracking-wide transition-[color,border-color,box-shadow,transform] duration-300 hover:scale-[1.02] ${
            glow
              ? "border-aurora-violet/70 text-ink shadow-[0_0_20px_rgba(139,95,224,0.3),inset_0_0_12px_rgba(139,95,224,0.08)] hover:border-aurora-violet hover:shadow-[0_0_40px_rgba(139,95,224,0.5),inset_0_0_16px_rgba(139,95,224,0.16)]"
              : "border-hairline-strong text-ink hover:border-ink/60 hover:shadow-[0_0_24px_rgba(139,95,224,0.2)]"
          } ${className}`}
        >
          {children}
        </Link>
      </span>
    </span>
  );
}
