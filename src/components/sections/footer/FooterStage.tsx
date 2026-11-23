"use client";

import { useRef, type ReactNode } from "react";
import MeshGradient from "./MeshGradient";

/**
 * The footer's frame: full width, no card. The mesh gradient fills it and
 * rises out of the page background over its first ~320px (a mask from clear
 * to full), so the newsletter above flows into it with no edge. The whole
 * footer is the gradient's pointer area.
 */
export default function FooterStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <footer ref={ref} aria-label="Site footer" className="theme-light relative isolate overflow-hidden bg-light-surface">
      <MeshGradient
        target={ref}
        className="-z-10 [mask-image:linear-gradient(to_bottom,transparent_0,black_320px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_320px)]"
      />
      {children}
    </footer>
  );
}
