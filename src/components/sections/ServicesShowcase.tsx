"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  SiFigma,
  SiSketch,
  SiFramer,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiWordpress,
  SiWebflow,
  SiGoogleanalytics,
  SiShopify,
  SiWoocommerce,
  SiStripe,
  SiPython,
  SiLangchain,
  SiHuggingface,
  SiZapier,
} from "react-icons/si";
import type { IconType } from "react-icons";
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
 * The list-drives-a-panel interaction mirrors Industries.tsx's own pattern
 * (hover/focus/click sets the active index, key={active} + .lens-fade-in
 * crossfades the panel, .icon-pop-in on the icon — all already-established
 * sitewide classes) and the header now uses that same section's exact
 * eyebrow/title-left, description+CTA-right layout, rather than stacking
 * everything in one left column.
 *
 * AI & Automation leads the list — same emphasis ServicePillars gave it
 * (that file's own ORDERED_COLUMNS reorder, kept here) — and the tool-icon
 * row reuses that file's TOOL_ICONS mapping verbatim.
 */
const TOOL_ICONS: Record<string, IconType[]> = {
  ai: [SiPython, SiLangchain, SiHuggingface, SiZapier],
  design: [SiFigma, SiSketch, SiFramer],
  engineering: [SiReact, SiNextdotjs, SiNodedotjs, SiTypescript],
  websites: [SiWordpress, SiWebflow, SiGoogleanalytics],
  commerce: [SiShopify, SiWoocommerce, SiStripe],
};

const AI_COLUMN = SERVICE_COLUMNS.find((c) => c.id === "ai")!;
const ORDERED_COLUMNS = [AI_COLUMN, ...SERVICE_COLUMNS.filter((c) => c.id !== "ai")];

function ToolRow({ id, size = 20, iconSize = 10 }: { id: string; size?: number; iconSize?: number }) {
  const tools = TOOL_ICONS[id];
  if (!tools) return null;
  return (
    <div className="flex items-center gap-1.5">
      {tools.map((ToolIcon, i) => (
        <span
          key={i}
          style={{ height: size, width: size }}
          className="flex shrink-0 items-center justify-center rounded-full border border-hairline bg-canvas text-ink-faint"
        >
          <ToolIcon aria-hidden size={iconSize} />
        </span>
      ))}
    </div>
  );
}

export default function ServicesShowcase() {
  const [active, setActive] = useState(0);
  const activeCol = ORDERED_COLUMNS[active];

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
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>Our Services</SectionEyebrow>
                <SectionTitle id="services-heading" className="max-w-lg">
                  One team to design, build, and automate your product.
                </SectionTitle>
              </div>
              <div className="flex items-center gap-4">
                <SectionDescription className="max-w-xs">
                  Five disciplines working together, from your first sketch to a shipped, supported product.
                </SectionDescription>
                <Link
                  href="/services"
                  className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
                >
                  Explore all
                  <ArrowRight size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-12 grid gap-4 lg:grid-cols-[400px_1fr] lg:gap-6">
              {/* Left — tab cards */}
              <div className="flex flex-col gap-3">
                {ORDERED_COLUMNS.map((col, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={isActive}
                      className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 ${
                        isActive
                          ? "border-aurora-violet/25 bg-canvas shadow-[0_18px_40px_rgba(124,108,255,0.16)]"
                          : "border-hairline bg-canvas/60 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-canvas"
                      }`}
                    >
                      <span className="w-5 shrink-0 font-urbanist text-[11px] font-semibold text-ink-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                          isActive ? "bg-aurora-violet text-white" : "mega-icon-tile text-aurora-indigo"
                        }`}
                      >
                        <Icon name={SERVICE_ICONS[col.id]} size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={`block font-urbanist text-[15px] font-bold leading-snug transition-colors duration-300 ${
                              isActive ? "text-ink" : "text-ink-dim"
                            }`}
                          >
                            {col.title}
                          </span>
                          {col.flagship && (
                            <span className="shrink-0 rounded-full bg-aurora-violet/10 px-2 py-0.5 font-urbanist text-[9px] font-bold uppercase tracking-wide text-aurora-violet">
                              New
                            </span>
                          )}
                        </span>
                        <span className="mt-1.5 block">
                          <ToolRow id={col.id} />
                        </span>
                      </span>
                      <ArrowRight
                        size={15}
                        strokeWidth={1.75}
                        className={`shrink-0 transition-[transform,opacity] duration-200 ${
                          isActive
                            ? "translate-x-0.5 text-aurora-violet opacity-100"
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
                className="lens-fade-in relative flex flex-col overflow-hidden rounded-[28px] border border-hairline bg-[#fafafa] p-7 shadow-[0_1px_2px_rgba(9,9,11,0.04)] lg:p-10"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
                  style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.16), transparent)" }}
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span className="icon-pop-in mega-icon-tile flex h-14 w-14 items-center justify-center rounded-2xl text-aurora-violet">
                    <Icon name={SERVICE_ICONS[activeCol.id]} size={24} />
                  </span>
                  <ToolRow id={activeCol.id} size={30} iconSize={14} />
                </div>

                <Link href={activeCol.href} className="group/title relative z-10 mt-6 inline-flex items-start gap-2">
                  <h3 className="font-urbanist text-2xl font-bold leading-snug tracking-tight text-ink sm:text-[28px]">
                    {activeCol.title}
                  </h3>
                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                    className="mt-2 shrink-0 text-ink-faint transition-transform duration-200 group-hover/title:translate-x-1 group-hover/title:text-aurora-violet"
                  />
                </Link>
                <p className="relative z-10 mt-1.5 max-w-lg font-urbanist text-[12.5px] font-medium uppercase tracking-[0.06em] text-ink-faint">
                  {activeCol.tags}
                </p>
                <p className="relative z-10 mt-4 max-w-lg font-urbanist text-[15px] leading-relaxed text-ink-dim">
                  {activeCol.blurb}
                </p>

                <ul className="relative z-10 mt-7 grid flex-1 content-start gap-x-8 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-2">
                  {activeCol.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group/row flex items-start gap-2.5 rounded-lg py-1 font-urbanist transition-colors duration-200"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-hairline bg-canvas text-ink-faint transition-colors duration-200 group-hover/row:border-aurora-violet/30 group-hover/row:text-aurora-violet">
                          <Icon name={l.icon} size={13} />
                        </span>
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
