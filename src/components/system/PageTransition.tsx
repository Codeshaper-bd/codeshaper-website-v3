"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Curtain-wipe route transition. Next.js App Router swaps page content
 * essentially instantly (no router "start navigating" event to hook into
 * the way Pages Router had), so covering AFTER the swap risks a one-frame
 * flash of the new page. Instead this covers the viewport on link *click* —
 * before navigation even starts — then reveals once the new pathname has
 * actually mounted. That's also why this lives in the root layout rather
 * than per-page SiteShell: layouts persist across client-side navigation,
 * so the click listener and the reveal-on-pathname-change effect both stay
 * alive for the whole visit instead of remounting per page.
 *
 * Deliberately does NOT check `e.defaultPrevented` to skip a click — every
 * real Next.js <Link> navigation already calls preventDefault() itself (via
 * its own onClick, attached directly to the anchor, which fires before this
 * document-level bubble listener) as part of doing client-side routing
 * instead of a full page load. Treating that as "not a navigation, skip it"
 * would skip the cover animation on literally every real internal link
 * click — confirmed by instrumenting this handler directly: it never ran
 * for any Link click until this check was removed. The href/target/origin/
 * same-pathname checks below are what actually distinguish "not worth
 * covering for" clicks (hash links, external links, modified clicks).
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const reduced = usePrefersReducedMotion();
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = () => {
    if (failsafe.current) {
      clearTimeout(failsafe.current);
      failsafe.current = null;
    }
    const overlay = overlayRef.current;
    const mark = markRef.current;
    if (!overlay || !mark) return;
    gsap.set(overlay, { transformOrigin: "bottom" });
    gsap.killTweensOf([overlay, mark]);
    gsap.to(mark, { opacity: 0, duration: 0.15 });
    gsap.to(overlay, { scaleY: 0, duration: 0.55, ease: "power3.inOut", delay: 0.05 });
  };

  useEffect(() => {
    if (reduced) return;
    const overlay = overlayRef.current;
    const mark = markRef.current;
    if (!overlay || !mark) return;

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.origin !== window.location.origin) return;
      if (anchor.pathname === window.location.pathname) return;

      gsap.set(overlay, { transformOrigin: "top" });
      gsap.killTweensOf([overlay, mark]);
      gsap.to(overlay, { scaleY: 1, duration: 0.45, ease: "power3.inOut" });
      gsap.to(mark, { opacity: 1, duration: 0.25, delay: 0.15 });

      // Safety net: force-reveal if the pathname never changes (a stuck
      // navigation, a route that errors before updating pathname, or a
      // click pattern this listener's guards didn't anticipate) — the
      // curtain must never permanently block the page, same reasoning as
      // Reveal.tsx's own IntersectionObserver failsafe.
      if (failsafe.current) clearTimeout(failsafe.current);
      failsafe.current = setTimeout(reveal, 4000);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduced]);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    if (reduced) return;
    reveal();
  }, [pathname, reduced]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] flex origin-top items-center justify-center bg-[#0a0a0f]"
        style={{ transform: "scaleY(0)" }}
      >
        <div ref={markRef} className="opacity-0">
          <svg width="40" height="40" viewBox="0 0 64 64" fill="none" className="text-[#8a7bff]">
            <path d="M32 4 L57 18 L57 46 L32 60 L7 46 L7 18 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {children}
    </>
  );
}
