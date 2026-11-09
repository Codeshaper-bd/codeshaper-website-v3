"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import {
  SERVICE_GROUPS,
  SERVICES_QUICK_ACCESS,
  SERVICES_FEATURED,
  MEGA_MENU_FOOTER,
  groupDescriptor,
  servicePath,
} from "@/data/services";
import { Icon } from "@/lib/icons";
import EngageCard from "./EngageCard";

/**
 * Services mega panel — 3 columns, everything visible at once (no
 * click-through, no active-pillar state). Left: How We Engage (shared with
 * Industries). Center: the 5 service groups as a flat list. Right: a featured
 * AI callout + quick-access chips. Footer: count + two links.
 */
export default function MegaPanel() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <div className="grid grid-cols-[0.95fr_1.08fr_270px] gap-4">
        <EngageCard />

        {/* Center — Core Services */}
        <div className="menu-col min-w-0">
          <p className="mega-col-label mb-3 px-1">Core Services</p>
          <ul>
            {SERVICE_GROUPS.map((group) => (
              <li key={group.slug}>
                <Nav.Link asChild>
                  <Link href={servicePath(group.slug)} className="mega-row group flex items-center gap-3.5 rounded-xl p-2.5">
                    <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
                      <Icon name={group.icon} size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="mega-row-name font-urbanist text-base font-semibold leading-snug text-ink transition-colors duration-150">
                          {group.name}
                        </span>
                        {group.flagship && (
                          <span className="shrink-0 rounded-full border border-hairline px-1.5 py-px font-urbanist text-[10px] leading-tight text-aurora-amber-dark">
                            New
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate font-urbanist text-[13px] leading-snug text-ink-dim">
                        {groupDescriptor(group)}
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
              <span className="mb-1.5 block font-urbanist text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/50">
                {SERVICES_FEATURED.eyebrow}
              </span>
              <span className="block font-urbanist text-[17px] font-bold leading-tight tracking-tight text-white">
                {SERVICES_FEATURED.title}
              </span>
              <span className="mt-1.5 block font-urbanist text-[13.5px] leading-relaxed text-white/85">
                {SERVICES_FEATURED.desc}
              </span>
            </Link>
          </Nav.Link>
          <p className="menu-section-label font-urbanist mb-2.5 px-1">Quick access</p>
          <div className="flex flex-wrap gap-1.5">
            {SERVICES_QUICK_ACCESS.map((c) => (
              <Nav.Link asChild key={c.href}>
                <Link href={c.href} className="mega-chip inline-flex items-center rounded-full px-3 py-1.5 font-urbanist text-[12.5px] font-semibold">
                  {c.label}
                </Link>
              </Nav.Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-canvas-raised px-5 py-3.5">
        <p className="font-urbanist text-[12.5px] text-ink-dim">
          <span className="font-semibold text-ink">{MEGA_MENU_FOOTER.count}</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-hairline-strong align-middle" aria-hidden />
          {MEGA_MENU_FOOTER.tagline}
        </p>
        <div className="flex items-center gap-4">
          <Nav.Link asChild>
            <Link href="/case-studies" className="font-urbanist text-[13px] text-ink-dim transition-colors hover:text-ink">
              View Case Studies →
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link
              href="/services"
              className="rounded-full border border-aurora-indigo/30 bg-aurora-indigo/5 px-4 py-2 font-urbanist text-[13px] font-semibold text-aurora-violet transition-colors hover:border-aurora-violet hover:bg-aurora-violet hover:text-white"
            >
              Explore All Services →
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
