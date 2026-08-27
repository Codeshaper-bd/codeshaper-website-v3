"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICE_COLUMNS } from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/**
 * Services — interactive explorer (tab list + detail panel). Replaces
 * ServicePillars.tsx's card grid on the homepage; that file is untouched
 * and its usage in page.tsx is just commented out, pending a side-by-side
 * call on which one stays.
 *
 * The list-drives-a-panel interaction mirrors Industries.tsx exactly
 * (hover/focus/click sets the active index, key={active} + .lens-fade-in
 * crossfades the panel, .icon-pop-in on the icon — both already-established
 * sitewide classes, not new ones) — just with the list and panel swapped
 * left-to-right to match the requested reference layout.
 */
export default function ServicesShowcase() {
  const [active, setActive] = useState(0);
  const activeCol = SERVICE_COLUMNS[active];

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section
        className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24"
        aria-labelledby="services-heading"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionEyebrow>Our Services</SectionEyebrow>
            <SectionTitle id="services-heading" size="lg" className="max-w-2xl">
              Product design, engineering, and AI automation — under one roof.
            </SectionTitle>
            <SectionDescription className="mt-5 max-w-2xl">
              Five core disciplines, one accountable team: UX/UI and product strategy, web and mobile engineering,
              growth-ready websites, commerce builds, and practical AI automation — delivered with weekly visibility
              from kickoff to launch.
            </SectionDescription>
            <Link
              href="/services"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
            >
              Explore All Services
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-14 grid gap-4 lg:grid-cols-[360px_1fr] lg:gap-6">
              {/* Left — tab list */}
              <div className="flex flex-col gap-1.5 rounded-[24px] border border-hairline bg-[#fafafa] p-3">
                {SERVICE_COLUMNS.map((col, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={isActive}
                      className={`group relative flex items-center gap-3.5 overflow-hidden rounded-2xl px-4 py-3.5 text-left transition-colors duration-300 ${
                        isActive ? "bg-canvas shadow-[0_10px_28px_rgba(11,15,25,0.08)]" : "hover:bg-canvas/70"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-y-2.5 left-0 w-[3px] rounded-full bg-aurora-violet transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span
                        className={`mega-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                          isActive ? "text-aurora-violet" : "text-aurora-indigo"
                        }`}
                      >
                        <Icon name={SERVICE_ICONS[col.id]} size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-urbanist text-[15px] font-bold leading-snug transition-colors duration-300 ${
                            isActive ? "text-ink" : "text-ink-dim"
                          }`}
                        >
                          {col.title}
                        </span>
                        {col.flagship && (
                          <span className="mt-1 inline-block rounded-full bg-aurora-violet/10 px-2 py-0.5 font-urbanist text-[9.5px] font-bold uppercase tracking-wide text-aurora-violet">
                            New
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        size={15}
                        strokeWidth={1.75}
                        className={`shrink-0 transition-[transform,opacity] duration-200 ${
                          isActive
                            ? "translate-x-0.5 text-ink opacity-100"
                            : "text-ink-faint opacity-0 group-hover:opacity-60"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right — detail panel */}
              <div
                key={active}
                className="lens-fade-in relative overflow-hidden rounded-[24px] border border-hairline bg-[#fafafa] p-7 lg:p-10"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-7 top-7 hidden grid-cols-3 gap-1.5 sm:grid lg:right-10 lg:top-10"
                >
                  {[0.5, 0.15, 0.3, 0.15, 0.6, 0.15, 0.3, 0.15, 0.5].map((o, i) => (
                    <span key={i} className="h-3 w-3 rounded-[4px] bg-aurora-violet" style={{ opacity: o }} />
                  ))}
                </div>

                <span className="icon-pop-in mega-icon-tile flex h-12 w-12 items-center justify-center rounded-xl text-aurora-violet">
                  <Icon name={SERVICE_ICONS[activeCol.id]} size={22} />
                </span>

                <Link href={activeCol.href} className="group/title relative z-10 mt-5 inline-flex items-start gap-2">
                  <h3 className="font-urbanist text-2xl font-bold leading-snug tracking-tight text-ink sm:text-[28px]">
                    {activeCol.title}
                  </h3>
                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                    className="mt-2 shrink-0 text-ink-faint transition-transform duration-200 group-hover/title:translate-x-1 group-hover/title:text-aurora-violet"
                  />
                </Link>
                <p className="mt-1.5 max-w-lg font-urbanist text-[12.5px] font-medium uppercase tracking-[0.06em] text-ink-faint">
                  {activeCol.tags}
                </p>
                <p className="mt-4 max-w-lg font-urbanist text-[15px] leading-relaxed text-ink-dim">{activeCol.blurb}</p>

                <ul className="relative z-10 mt-7 grid gap-x-8 gap-y-3.5 border-t border-hairline pt-6 sm:grid-cols-2">
                  {activeCol.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group/row flex items-start gap-2.5 rounded-lg py-1 font-urbanist transition-colors duration-200"
                      >
                        <Icon
                          name={l.icon}
                          size={15}
                          className="mt-0.5 shrink-0 text-ink-faint transition-colors duration-200 group-hover/row:text-aurora-violet"
                        />
                        <span>
                          <span className="block text-[14px] font-semibold text-ink-dim transition-colors duration-200 group-hover/row:text-ink">
                            {l.label}
                          </span>
                          <span className="block text-[12.5px] font-normal leading-snug text-ink-faint">{l.desc}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
