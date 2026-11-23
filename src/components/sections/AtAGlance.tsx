"use client";

import { useEffect, useRef, useState } from "react";
import { SERVED } from "@/components/hero/globe/servedCountries";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import WorldMap from "@/components/sections/WorldMap";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";

/**
 * Homepage › CodeShaper at a glance: the four figures that size the company
 * up in five seconds, over a dotted world map of the countries clients come
 * from, with Dhaka as the delivery hub. Right after the client logos, so the
 * proof builds in one move: who trusts us, then how big and how far.
 *
 * Figures: years, brands and reviews are owner-supplied (18 Nov 2026, also in
 * the hero intro; CHECK before launch); countries follow the globe's list so
 * the two never disagree. A white card on the floating frame.
 */
const STATS = [
  { value: "10+", label: "Years building software" },
  { value: "350+", label: "Brands served" },
  { value: `${SERVED.length}`, label: "Countries served" },
  { value: "150+", label: "Client reviews" },
];

const parse = (v: string) => {
  const m = /^(\d+)(.*)$/.exec(v);
  return m ? { n: Number(m[1]), suffix: m[2] } : { n: 0, suffix: v };
};

export default function AtAGlance({ copy }: { copy?: CopyOf<"atAGlance"> }) {
  const c = homeCopy("atAGlance", copy);
  const ref = useRef<HTMLDListElement>(null);
  const [t, setT] = useState(1);

  // count up once, when the figures come into view
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setT(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / 1300);
          setT(1 - Math.pow(1 - k, 3));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section aria-labelledby="glance-heading" className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
              <div>
                <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
                <SectionTitle id="glance-heading" className="max-w-[20ch] text-balance">
                  {c.title}
                </SectionTitle>
              </div>
              <dl ref={ref} className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
                {STATS.map((s, i) => {
                  const { n, suffix } = parse(s.value);
                  return (
                    <div key={s.label} className={`flex flex-col-reverse gap-2 ${i > 0 ? "sm:border-l sm:border-[#0b0f19]/[0.08] sm:pl-6" : ""} ${i % 2 ? "border-l border-[#0b0f19]/[0.08] pl-6 sm:pl-6" : ""}`}>
                      <dt className="whitespace-nowrap font-urbanist text-[13px] leading-snug text-ink-dim">{s.label}</dt>
                      <dd className="font-urbanist text-[38px] font-bold leading-none tracking-[-0.04em] text-ink tabular-nums lg:text-[44px]">
                        <span aria-hidden>
                          {Math.round(n * t)}
                          {suffix}
                        </span>
                        <span className="sr-only">{s.value}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 lg:mt-16">
              <WorldMap hubLabel={c.hubLabel} />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#0b0f19]/[0.07] pt-5 font-urbanist text-[13px] text-ink-dim">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full border-2 border-white bg-[#615fff] shadow-[0_0_0_3px_rgba(97,95,255,0.18)]" />
                    {c.mapLabel} <b className="font-semibold text-ink">{SERVED.length}</b>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full border-2 border-white bg-[#0b0f19] shadow-[0_0_0_3px_rgba(11,15,25,0.1)]" />
                    {c.hubLabel}
                  </span>
                </div>
                <p className="sr-only">Client countries: {SERVED.map((s) => s.name).join(", ")}.</p>
                <p aria-hidden className="hidden text-ink-faint sm:block">
                  Americas · Europe · Middle East · Africa · Asia-Pacific
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
