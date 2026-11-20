"use client";

import { lazy, Suspense, useEffect, useRef, useState, type ComponentType, type LazyExoticComponent } from "react";

/**
 * A homepage section whose CODE loads on approach, not at page load.
 *
 * LazyHydrate defers the hydration work; this also defers the download: each
 * section below the first screen is its own chunk (dynamic import), fetched
 * only when it comes within `rootMargin` of the viewport. Its icon libraries
 * (react-icons in Services and Tech Stack), physics, canvases and data come
 * with it, so none of that is downloaded, parsed or run during the first load.
 *
 *  · Server: the section renders in full (React.lazy resolves during SSR),
 *    so the HTML is complete, readable and indexable.
 *  · Client, at load: the wrapper keeps that server HTML as-is (an empty
 *    dangerouslySetInnerHTML with suppressHydrationWarning) without loading
 *    or hydrating the section.
 *  · Client, on approach: it starts the download and, while the chunk
 *    arrives, shows the same server HTML as the Suspense fallback, so the
 *    section never blinks; then the live section takes over.
 *
 * The page passes a name (a server component cannot pass functions).
 */
const LOADERS = {
  servicesBento: () => import("@/components/sections/services-bento/ServicesBento"),
  humanAiFlow: () => import("@/components/sections/human-ai-flow/HumanAiFlow"),
  industries: () => import("@/components/sections/Industries"),
  caseStudies: () => import("@/components/sections/CaseStudiesFeatured"),
  testimonials: () => import("@/components/sections/Testimonials"),
  engagementModels: () => import("@/components/sections/EngagementModels"),
  techStack: () => import("@/components/sections/TechStack"),
  aboutStudio: () => import("@/components/sections/AboutStudio"),
  faq: () => import("@/components/sections/FAQ"),
  impactWorkflow: () => import("@/components/sections/ImpactWorkflow"),
} satisfies Record<string, () => Promise<{ default: ComponentType }>>;

export type SectionName = keyof typeof LOADERS;

const SECTIONS = Object.fromEntries(Object.entries(LOADERS).map(([name, load]) => [name, lazy(load)])) as unknown as Record<
  SectionName,
  LazyExoticComponent<ComponentType>
>;

/**
 * While a section is still asleep, the browser may skip its style, layout
 * and paint entirely when it is off screen (content-visibility: auto), with
 * a placeholder height. Removed as soon as the section wakes, so no
 * containment applies once it is live (sticky, pins and overflow behave as
 * normal). Cuts the first load's layout work on long pages.
 */
const DORMANT = { contentVisibility: "auto", containIntrinsicSize: "auto 1000px" } as const;

export default function LazySection({ name, rootMargin = "800px 0px" }: { name: SectionName; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // server: render the section; client: start dormant (keep the server HTML)
  const [awake, setAwake] = useState(() => typeof window === "undefined");
  const serverHtml = useRef("");

  useEffect(() => {
    if (awake) return;
    const el = ref.current;
    if (!el) return;
    let done = false;
    const wake = () => {
      if (done) return;
      done = true;
      serverHtml.current = el.innerHTML; // shown while the chunk downloads
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
    const onFocus = () => wake();
    el.addEventListener("focusin", onFocus);
    return () => {
      io.disconnect();
      ARM.forEach((ev) => window.removeEventListener(ev, arm));
      el.removeEventListener("focusin", onFocus);
    };
  }, [awake, rootMargin]);

  if (!awake) return <div ref={ref} style={DORMANT} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />;
  const Section = SECTIONS[name];
  return (
    <div ref={ref} style={typeof window === "undefined" ? DORMANT : undefined}>
      <Suspense fallback={serverHtml.current ? <div dangerouslySetInnerHTML={{ __html: serverHtml.current }} /> : null}>
        <Section />
      </Suspense>
    </div>
  );
}
