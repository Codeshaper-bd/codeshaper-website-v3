"use client";

import { useEffect, useRef, useState } from "react";
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
 * Two structural bugs from the previous pass, both fixed here rather than
 * styled around:
 *  1. Services have different sub-link counts (engineering 6, commerce 5,
 *     the rest 4) — showing them all meant the detail panel's height (and
 *     so the whole section's height) changed as the mouse moved down the
 *     list. Capped to MAX_VISIBLE_LINKS with a "+N more" link instead, so
 *     every panel renders the same 2-row grid.
 *  2. Tab cards sized to their own content meant a two-line title (e.g.
 *     "Experience & Product Design") made that card taller than its
 *     neighbors. Fixed height (TAB_HEIGHT) on every card instead.
 *
 * With every tab card now a fixed, identical height, a single sliding
 * highlight (measured via refs, animated with a CSS transform) can track
 * the active row — the same "moving pill" pattern used by e.g. segmented
 * controls — instead of each button drawing its own active background.
 *
 * Tab list and detail panel share one bg-[#fafafa] card (a border between
 * them, not a color difference, is what separates the two) instead of each
 * having its own background — and the active-row highlight is a plain
 * bg-canvas/border-hairline chip with no shadow, not a colored glow.
 *
 * The tab list used to have its own `py-3` breathing room, with the
 * indicator offset `top-3` to match — which meant the active highlight
 * never actually reached the card's own top/bottom edge when the first or
 * last tab was selected (a ~12px strip of the card's own background showed
 * above/below it instead of the highlight filling flush to the corner).
 * Removed both: the list now has zero padding, the indicator starts at
 * `top-0`, and its translateY math (`active * TAB_HEIGHT`) already assumed
 * no extra offset, so this needed no other change. The buttons' own
 * `rounded-2xl` is gone too — they're transparent so it was inert, but per
 * direct request individual tab rows stay perfectly square; only the
 * shared card's four outer corners (handled above) round at all.
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
const MAX_VISIBLE_LINKS = 4;
const TAB_HEIGHT = 100;

function ToolRow({ id, size = 22, iconSize = 11 }: { id: string; size?: number; iconSize?: number }) {
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
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.style.setProperty("--indicator-y", `${active * TAB_HEIGHT}px`);
  }, [active]);

  const visibleLinks = activeCol.links.slice(0, MAX_VISIBLE_LINKS);
  const moreCount = activeCol.links.length - visibleLinks.length;

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
            <div className="mt-12 overflow-hidden rounded-bl-[28px] rounded-br-[28px] border border-hairline bg-light-surface lg:grid lg:grid-cols-[400px_1fr] lg:rounded-bl-none lg:rounded-tr-[28px]">
              {/* Left — tab list with a sliding highlight tracking the active row.
                  Rows sit flush (no gap) with a border-b divider between each one,
                  instead of gapped standalone cards — the indicator's translateY
                  math is exactly `active * TAB_HEIGHT` because of that (no gap to
                  add per row).
                  Corner radius is per-corner, not uniform: whichever side the tab
                  list occupies (top on mobile where it stacks first, left on
                  desktop) stays perfectly square in both layouts, so the full-
                  width indicator/dividers never get clipped into a curve by the
                  card's own rounding — only the detail-panel side (bottom on
                  mobile, right on desktop) is rounded. bottom-right belongs to
                  the panel in both layouts, so it needs no lg: override. */}
              <div ref={listRef} className="relative flex flex-col border-b border-hairline lg:border-b-0 lg:border-r">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 z-0 border border-hairline bg-canvas transition-transform duration-300 ease-out-expo"
                  style={{ height: TAB_HEIGHT, transform: "translateY(var(--indicator-y, 0px))" }}
                />
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
                      style={{ height: TAB_HEIGHT }}
                      className={`group relative z-10 flex shrink-0 items-center gap-4 px-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-aurora-violet/40 ${
                        i > 0 ? "border-t border-hairline" : ""
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
                        <span className="mt-2 block">
                          <ToolRow id={col.id} />
                        </span>
                      </span>
                      <ArrowRight
                        size={15}
                        strokeWidth={1.75}
                        className={`shrink-0 transition-[transform,opacity] duration-200 ${
                          isActive ? "translate-x-0.5 text-aurora-violet opacity-100" : "text-ink-faint opacity-0"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right — detail panel. Links capped to MAX_VISIBLE_LINKS so every
                  panel renders the same height, whichever service is active. */}
              <div
                key={active}
                className="lens-fade-in relative flex min-h-[440px] flex-col overflow-hidden p-7 lg:p-10"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
                  style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.18), transparent)" }}
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span className="icon-pop-in mega-icon-tile flex h-14 w-14 items-center justify-center rounded-2xl text-aurora-violet">
                    <Icon name={SERVICE_ICONS[activeCol.id]} size={24} />
                  </span>
                  <ToolRow id={activeCol.id} size={32} iconSize={15} />
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

                <ul className="relative z-10 mt-7 grid gap-x-8 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-2">
                  {visibleLinks.map((l) => (
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

                <div className="relative z-10 mt-auto flex items-center justify-between gap-4 pt-6">
                  {moreCount > 0 ? (
                    <Link
                      href={activeCol.href}
                      className="inline-flex items-center gap-1.5 font-urbanist text-[13px] font-semibold text-aurora-violet"
                    >
                      +{moreCount} more under {activeCol.title}
                      <ArrowRight size={13} strokeWidth={1.75} />
                    </Link>
                  ) : (
                    <span />
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
