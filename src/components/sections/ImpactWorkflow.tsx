"use client";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";

import { useEffect, useRef, useState } from "react";
import { SERVED } from "@/components/hero/globe/servedCountries";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PhotoCloud from "./PhotoCloud";
import styles from "./PhotoCloud.module.css";

const STATS = [
  { value: "10+", label: "years building software" },
  { value: "350+", label: "brands served" },
  { value: `${SERVED.length}`, label: "countries with clients" },
  { value: "150+", label: "client reviews" },
];


const parse = (v: string) => {
  const m = /^(\d+)(.*)$/.exec(v);
  return m ? { n: Number(m[1]), suffix: m[2] } : { n: 0, suffix: v };
};

export default function ImpactWorkflow({ copy }: { copy?: CopyOf<"impactWorkflow"> }) {
  const c = homeCopy("impactWorkflow", copy);
  const ref = useRef<HTMLDListElement>(null);
  const [active, setActive] = useState(-1);
  const [t, setT] = useState(1);

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
      <PhotoCloud>
        <div className={styles.heading}>
          <SectionEyebrow className="mx-auto">{c.eyebrow}</SectionEyebrow>
          <SectionTitle id="impact-heading" className="mx-auto max-w-[22ch] text-balance">
            {c.title}
          </SectionTitle>
        </div>
        <div className={styles.stats}>
          <dl ref={ref} className="grid h-full grid-cols-2 sm:grid-cols-4" onMouseLeave={() => setActive(-1)}>
            {STATS.map((s, i) => {
              const { n, suffix } = parse(s.value);
              const on = i === active;
              return (
                <div key={s.label} onMouseEnter={() => setActive(i)} className="relative flex flex-col-reverse items-center justify-center gap-1 text-center">
                  <dt className={`text-xs sm:text-sm transition-colors duration-300 ${on ? "text-[#4e5362]" : "text-[#686e7d]"}`}>{s.label}</dt>
                  <dd className={`text-[clamp(28px,5svh,56px)] font-semibold leading-none tracking-[-0.04em] tabular-nums transition-colors duration-300 ${on ? "text-[#171a24]" : "text-[#272b3d]/75"}`}>
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

      </PhotoCloud>
    </div>
  );
}
