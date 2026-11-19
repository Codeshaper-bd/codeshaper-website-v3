"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Hydrate on approach. The server renders the section as usual (full HTML:
 * visible, readable, indexable). In the browser, React leaves that HTML in
 * place and does NOT hydrate it at load; it renders the section for real
 * only when it comes within `rootMargin` of the viewport (or the visitor
 * starts interacting). Below-the-fold sections then cost nothing during the
 * first load, which is what blocks the main thread on slow phones.
 *
 * How: on the client's first render the wrapper returns an empty
 * dangerouslySetInnerHTML with suppressHydrationWarning, so React keeps the
 * server markup untouched instead of hydrating it; once near the viewport it
 * renders `children` normally (same markup, so nothing visibly changes).
 *
 * Use only for sections below the first screen.
 */
/**
 * While a section is still asleep, the browser may skip its style, layout
 * and paint entirely when it is off screen (content-visibility: auto), with
 * a placeholder height. Removed as soon as the section wakes, so no
 * containment applies once it is live (sticky, pins and overflow behave as
 * normal). Cuts the first load's layout work on long pages.
 */
const DORMANT = { contentVisibility: "auto", containIntrinsicSize: "auto 1000px" } as const;

export default function LazyHydrate({ children, rootMargin = "800px 0px" }: { children: ReactNode; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // server: render the section; client: start dormant
  const [awake, setAwake] = useState(() => typeof window === "undefined");

  useEffect(() => {
    if (awake) return;
    const el = ref.current;
    if (!el) return;
    let done = false;
    const wake = () => {
      if (done) return;
      done = true;
      setAwake(true);
    };
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && wake(), { rootMargin });
    // Watch only once the visitor interacts (scroll, touch, key, pointer):
    // nothing wakes during the page load itself, and they still wake 800px
    // before they come into view.
    const ARM = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      ARM.forEach((ev) => window.removeEventListener(ev, arm));
      io.observe(el);
    };
    ARM.forEach((ev) => window.addEventListener(ev, arm, { passive: true }));
    // a jump (anchor link, Skip intro, keyboard focus) also wakes it
    const onFocus = () => wake();
    el.addEventListener("focusin", onFocus);
    return () => {
      io.disconnect();
      ARM.forEach((ev) => window.removeEventListener(ev, arm));
      el.removeEventListener("focusin", onFocus);
    };
  }, [awake, rootMargin]);

  if (!awake) return <div ref={ref} style={DORMANT} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />;
  return (
    <div ref={ref} style={typeof window === "undefined" ? DORMANT : undefined}>
      {children}
    </div>
  );
}
