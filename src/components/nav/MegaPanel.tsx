"use client";

import { useState } from "react";
import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { SERVICE_COLUMNS } from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";

/**
 * Services mega panel — sidebar + detail layout.
 *
 * Left rail: the 5 pillars as icon + title rows (one line each, no wrapping).
 * Hovering/focusing a row swaps the right two-thirds to that pillar's
 * sub-links + promo card. Far less text on screen at once, and every label
 * gets room to breathe. Link content is unchanged from earlier passes.
 *
 * Keyboard: the rail rows are real links, so Tab moves through them and the
 * detail panel follows focus (onFocus mirrors onMouseEnter). Radix still owns
 * open/close/Escape/outside-click.
 */
export default function MegaPanel() {
  const [activeId, setActiveId] = useState(SERVICE_COLUMNS[0].id);
  const active = SERVICE_COLUMNS.find((c) => c.id === activeId)!;

  return (
    <div className="mx-auto max-w-[1280px] px-10 py-9">
      <div className="grid grid-cols-[352px_1fr] gap-10">
        {/* ── Left rail ─────────────────────────────────────── */}
        <div className="border-r border-hairline pr-8">
          <p className="menu-section-label mb-4 px-3 font-body">
            Practices
          </p>
          <ul className="space-y-1">
            {SERVICE_COLUMNS.map((col) => {
              const on = col.id === activeId;
              return (
                <li key={col.id}>
                  <Nav.Link asChild>
                    <Link
                      href={col.href}
                      onMouseEnter={() => setActiveId(col.id)}
                      onFocus={() => setActiveId(col.id)}
                      data-on={on}
                      className="menu-row group relative flex items-center gap-3 rounded-xl px-3 py-3.5 transition-colors duration-200"
                    >
                      {/* active accent bar */}
                      <span
                        aria-hidden
                        className={`absolute left-0 top-1/2 h-7 w-[2px] -translate-y-1/2 rounded-r bg-aurora-indigo transition-transform duration-200 ${
                          on ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                      {col.flagship && (
                        <span
                          aria-hidden
                          className="ai-col-wash pointer-events-none absolute inset-0 rounded-lg opacity-[0.10]"
                          style={{
                            background:
                              "radial-gradient(120% 100% at 0% 50%, #667EEA 0%, #44549B 60%, #14B8A6 100%)",
                          }}
                        />
                      )}
                      <span
                        data-on={on}
                        className="icon-tile relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-canvas-raised text-aurora-indigo"
                      >
                        <Icon name={SERVICE_ICONS[col.id]} size={19} />
                      </span>
                      <span className="relative min-w-0 flex-1 pr-5">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span
                            className={`font-display text-[14.5px] font-medium leading-snug transition-colors duration-200 ${
                              on ? "text-ink" : "text-ink-dim group-hover:text-ink"
                            }`}
                          >
                            <span className="mr-1.5 text-[12px] text-ink-faint">{col.number}</span>
                            {col.title}
                          </span>
                          {col.flagship && (
                            <span className="shrink-0 rounded-full border border-hairline px-1.5 py-px font-body text-[10px] leading-tight text-aurora-amber">
                              New
                            </span>
                          )}
                        </span>
                      </span>
                      {/* absolute so it never squeezes the label */}
                      <ArrowRight
                        size={14}
                        strokeWidth={1.75}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                          on ? "text-ink opacity-100" : "opacity-0"
                        }`}
                      />
                    </Link>
                  </Nav.Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Right detail ──────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_280px] gap-10">
          {/* min-h keeps the panel a fixed height across pillars (no jump).
              Sub-services render as icon cards rather than a text list — with
              4–6 items that fills the pane instead of leaving it hollow. */}
          <div className="flex min-h-[336px] flex-col">
            <div className="mb-4 flex items-baseline gap-3">
              <p className="font-display text-[15px] font-medium text-ink">{active.title}</p>
              <span className="font-body text-[11.5px] text-ink-faint">
                {active.links.length} services
              </span>
            </div>
            <p className="mb-5 max-w-md font-body text-[13.5px] leading-relaxed text-ink-dim">
              {active.blurb}
            </p>
            {/* key forces a re-mount so cards stagger in on each pillar change */}
            <ul key={active.id} className="detail-links grid flex-1 grid-cols-2 content-start gap-2">
              {active.links.map((l) => (
                <li key={l.href}>
                  <Nav.Link asChild>
                    <Link
                      href={l.href}
                      className="menu-row group/l flex h-full items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors duration-200 hover:border-white/[0.08]"
                    >
                      <span className="icon-tile mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-canvas-raised text-aurora-indigo group-hover/l:border-aurora-indigo/45">
                        <Icon name={l.icon} size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="font-body text-[13.5px] font-medium leading-snug text-ink-dim transition-colors group-hover/l:text-ink">
                            {l.label}
                          </span>
                          <ArrowRight
                            size={12}
                            strokeWidth={2}
                            className="shrink-0 -translate-x-1 text-aurora-indigo opacity-0 transition-all duration-200 group-hover/l:translate-x-0 group-hover/l:opacity-100"
                          />
                        </span>
                        <span className="mt-0.5 block font-body text-[11.5px] leading-snug text-ink-faint">
                          {l.desc}
                        </span>
                      </span>
                    </Link>
                  </Nav.Link>
                </li>
              ))}
            </ul>
            <Nav.Link asChild>
              <Link
                href={active.href}
                className="group/all mt-4 inline-flex w-fit items-center gap-1.5 font-body text-[13px] font-medium text-aurora-indigo transition-colors hover:text-ink"
              >
                View all {active.title}
                <ArrowRight
                  size={13}
                  strokeWidth={1.75}
                  className="transition-transform duration-200 group-hover/all:translate-x-0.5"
                />
              </Link>
            </Nav.Link>
          </div>

          {/* Promo card */}
          <Nav.Link asChild>
            <Link
              href="/work"
              className="glass group block self-start overflow-hidden rounded-xl transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/25"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/case-commerce.jpg"
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-5">
                <p className="font-body menu-section-label">
                  Case study
                </p>
                {/* PLACEHOLDER stat — needs sign-off */}
                <p className="mt-2 font-display text-[28px] font-bold leading-none text-ink">+38%</p>
                <p className="mt-2 font-body text-[13.5px] leading-relaxed text-ink-dim">
                  faster order flow after a commerce rebuild
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-body text-[13px] text-aurora-indigo">
                  Read the story
                  <ArrowRight
                    size={14}
                    strokeWidth={1.75}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          </Nav.Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
        <Nav.Link asChild>
          <Link
            href="/services"
            className="group inline-flex items-center gap-1.5 font-display text-sm font-medium text-ink transition-colors hover:text-aurora-violet"
          >
            All services
            <ArrowRight
              size={14}
              strokeWidth={1.75}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </Nav.Link>
        <p className="font-body text-[13px] text-ink-faint">
          Or tell us your goal —{" "}
          <Nav.Link asChild>
            <Link
              href="/contact"
              className="text-ink-dim underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Book a call
            </Link>
          </Nav.Link>
        </p>
      </div>
    </div>
  );
}
