"use client";

import { useEffect, useRef } from "react";
import { useMotionAllowed } from "@/lib/motion";

/**
 * Custom cursor (Pass 2 §2.2) — desktop ≥1024px, fine pointer, motion allowed.
 * - 7px dot 1:1 + 36px ring trailing ~100ms
 * - Over links/buttons/controls: ring scales ~2.5x, dot fades
 * - Over [data-cursor="drag"]: ring becomes a "drag" pill
 * - Over text inputs/textareas: custom cursor hides entirely (native caret)
 * - Progressive enhancement: `cursor:none` is applied via JS attribute only,
 *   never in base CSS — JS failure leaves the native cursor intact.
 */
export default function CustomCursor() {
  const allowed = useMotionAllowed();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!allowed) {
      document.documentElement.removeAttribute("data-custom-cursor");
      return;
    }
    document.documentElement.setAttribute("data-custom-cursor", "true");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
    let mode: "default" | "link" | "drag" | "text" = "default";

    const CLICKABLE = "a, button, [role='button'], select, label";
    const TEXTY = "input, textarea, [contenteditable]";

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as Element | null;
      let next: typeof mode = "default";
      if (t?.closest(TEXTY)) next = "text";
      else if (t?.closest("[data-cursor='drag']")) next = "drag";
      else if (t?.closest(CLICKABLE)) next = "link";
      if (next !== mode) {
        mode = next;
        dot.dataset.mode = mode;
        ring.dataset.mode = mode;
        // text fields: fully hide custom cursor, restore native caret
        document.documentElement.toggleAttribute("data-cursor-suspend", mode === "text");
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onLeave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };
    const onEnter = () => { dot.style.opacity = "1"; ring.style.opacity = "1"; };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeAttribute("data-custom-cursor");
      document.documentElement.removeAttribute("data-cursor-suspend");
    };
  }, [allowed]);

  if (!allowed) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[7px] w-[7px] rounded-full bg-ink transition-opacity duration-150 data-[mode=link]:opacity-0 data-[mode=drag]:opacity-0 data-[mode=text]:opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex h-9 w-9 items-center justify-center rounded-full border border-ink/40 transition-[width,height,background-color,border-color,opacity] duration-200 data-[mode=link]:h-[88px] data-[mode=link]:w-[88px] data-[mode=link]:border-ink/60 data-[mode=link]:bg-ink/5 data-[mode=drag]:h-16 data-[mode=drag]:w-16 data-[mode=drag]:border-ink data-[mode=drag]:bg-canvas/70 data-[mode=text]:opacity-0"
      >
        <span className="select-none font-urbanist text-[10px] uppercase tracking-widest text-ink opacity-0 transition-opacity duration-200 [[data-mode=drag]>&]:opacity-100">
          drag
        </span>
      </div>
    </>
  );
}
