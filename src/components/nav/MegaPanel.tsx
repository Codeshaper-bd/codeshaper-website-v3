"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { SERVICE_COLUMNS, SERVICES_QUICK_ACCESS, SERVICES_FEATURED } from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";
import EngageCard from "./EngageCard";

/**
 * Services mega panel — 3 columns, everything visible at once (no
 * click-through, no active-pillar state). Left: How We Engage (shared with
 * Industries). Center: the 5 practices as a flat list. Right: a featured
 * AI callout + quick-access chips. Footer: count + two links.
 */
export default function MegaPanel() {
  return (
    <div className="mx-auto max-w-[1180px] p-5">
      <div className="grid grid-cols-[0.95fr_1.08fr_270px] gap-4">
        <EngageCard />

        {/* Center — Core Services */}
        <div className="menu-col min-w-0">
          <p className="mega-col-label mb-3 px-1">Core Services</p>
          <ul>
            {SERVICE_COLUMNS.map((col) => (
              <li key={col.id}>
                <Nav.Link asChild>
                  <Link href={col.href} className="mega-row group flex items-center gap-3.5 rounded-xl p-2.5">
                    <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
                      <Icon name={SERVICE_ICONS[col.id]} size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="mega-row-name font-body text-[14px] font-semibold leading-snug text-ink transition-colors duration-150">
                          {col.title}
                        </span>
                        {col.flagship && (
                          <span className="shrink-0 rounded-full border border-hairline px-1.5 py-px font-body text-[10px] leading-tight text-aurora-amber-dark">
                            New
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate font-body text-[12px] leading-snug text-ink-dim">
                        {col.tags}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      strokeWidth={1.75}
                      className="mega-svc-arrow shrink-0 text-ink-faint transition-all duration-200"
                    />
                  </Link>
                </Nav.Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Featured + Quick access */}
        <div className="menu-col">
          <p className="mega-col-label mb-3 px-1">Featured</p>
          <Nav.Link asChild>
            <Link href={SERVICES_FEATURED.href} className="mega-feature-card group mb-5 block rounded-2xl p-4">
              <span className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.12] text-white">
                <Icon name={SERVICES_FEATURED.icon} size={17} />
              </span>
              <span className="mb-1.5 block font-body text-[9.5px] font-bold uppercase tracking-[0.1em] text-white/50">
                {SERVICES_FEATURED.eyebrow}
              </span>
              <span className="block font-display text-[17px] font-bold leading-tight tracking-tight text-white">
                {SERVICES_FEATURED.title}
              </span>
              <span className="mt-1.5 block font-body text-[12.5px] leading-relaxed text-white/85">
                {SERVICES_FEATURED.desc}
              </span>
            </Link>
          </Nav.Link>
          <p className="menu-section-label mb-2.5 px-1">Quick access</p>
          <div className="flex flex-wrap gap-1.5">
            {SERVICES_QUICK_ACCESS.map((c) => (
              <Nav.Link asChild key={c.href}>
                <Link href={c.href} className="mega-chip inline-flex items-center rounded-full px-3 py-1.5 font-body text-[11.5px] font-semibold">
                  {c.label}
                </Link>
              </Nav.Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-canvas-raised px-5 py-3.5">
        <p className="font-body text-[11.5px] text-ink-dim">
          <span className="font-semibold text-ink">5 services</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-hairline-strong align-middle" aria-hidden />
          Full-stack digital product studio
        </p>
        <div className="flex items-center gap-4">
          <Nav.Link asChild>
            <Link href="/work" className="font-body text-[12px] text-ink-dim transition-colors hover:text-ink">
              View Our Work →
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link
              href="/services"
              className="rounded-full border border-aurora-indigo/30 bg-aurora-indigo/5 px-4 py-2 font-body text-[12px] font-semibold text-aurora-violet transition-colors hover:border-aurora-violet hover:bg-aurora-violet hover:text-white"
            >
              Explore All Services →
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
