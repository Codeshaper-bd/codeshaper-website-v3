"use client";

import { useRef, type ReactNode } from "react";
import MeshGradient from "./MeshGradient";
import { FooterSceneProvider, useFooterScene } from "./scene";

/**
 * The footer's frame: full width, no card. The mesh gradient fills it and
 * rises out of the page background over its first ~320px (a mask from clear
 * to full), so the newsletter above flows into it with no edge. The whole
 * footer is the gradient's pointer area.
 *
 * Night scene (owner, 25 Nov 2026): the whole footer goes dark, not just the
 * landscape. It fades in from the page over the first 80px (above the first
 * line of text), the mesh switches to night colours and a few stars come out.
 * `data-scene` drives the `night:` variant and the token overrides in globals.css.
 */
export default function FooterStage({ children }: { children: ReactNode }) {
  return (
    <FooterSceneProvider>
      <Frame>{children}</Frame>
    </FooterSceneProvider>
  );
}

// fixed positions, so server and client render the same sky
const STARS = Array.from({ length: 70 }, (_, i) => ({ x: (i * 37.3) % 100, y: 4 + ((i * 23.7) % 92), r: i % 6 === 0 ? 1.6 : 1, d: (i % 7) * 0.45 }));

function Frame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scene } = useFooterScene();
  const night = scene === "night";
  return (
    <footer
      ref={ref}
      aria-label="Site footer"
      data-scene={scene}
      className="theme-light relative isolate overflow-hidden bg-light-surface"
      style={night ? { background: "linear-gradient(to bottom, var(--color-light-surface) 0, #14122e 80px)" } : undefined}
    >
      <MeshGradient
        key={night ? "night" : "day"}
        target={ref}
        night={night}
        className={
          night
            ? "-z-10 [mask-image:linear-gradient(to_bottom,transparent_0,black_80px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_80px)]"
            : "-z-10 [mask-image:linear-gradient(to_bottom,transparent_0,black_320px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_320px)]"
        }
      />
      {night && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-20 -z-10">
          {STARS.map((s, i) => (
            <span key={i} className="scene-star absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, animationDelay: `${s.d}s` }} />
          ))}
        </div>
      )}
      {children}
    </footer>
  );
}
