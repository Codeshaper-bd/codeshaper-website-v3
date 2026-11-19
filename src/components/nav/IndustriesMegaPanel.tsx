"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { INDUSTRIES, INDUSTRIES_POPULAR, INDUSTRIES_FEATURED } from "@/lib/navigation";
import { Icon } from "@/lib/icons";
import EngageCard from "./EngageCard";

/**
 * Industries mega panel, the original 3-column structure in glass: How We
 * Engage (shared box, left), the industries in a 2-column grid (center), a
 * dark-glass case-study card + popular-vertical chips (right), and a footer.
 */
export default function IndustriesMegaPanel() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <div className="grid grid-cols-[0.95fr_1.08fr_270px] gap-4">
        <EngageCard />

        {/* Center — Industries We Serve */}
        <div className="menu-col min-w-0">
          <p className="mega-col-label mb-3 px-1">Industries We Serve</p>
          <ul className="grid grid-cols-2 gap-1">
            {INDUSTRIES.map((ind) => (
              <li key={ind.href}>
                <Nav.Link asChild>
                  <Link href={ind.href} className="mega-row group flex items-start gap-2.5 rounded-xl p-2.5">
                    <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]">
                      <Icon name={ind.icon} size={16} />
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="mega-row-name block font-urbanist text-[15.5px] font-semibold leading-snug text-ink">{ind.label}</span>
                      <span className="mt-0.5 block font-urbanist text-[12.5px] leading-snug text-ink-dim">{ind.desc}</span>
                    </span>
                  </Link>
                </Nav.Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Case Study + Popular verticals */}
        <div className="menu-col">
          <p className="mega-col-label mb-3 px-1">Case Study</p>
          <Nav.Link asChild>
            <Link href={INDUSTRIES_FEATURED.href} className="mega-feature-card group mb-5 block rounded-[20px] p-4">
              <span className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-[11px] bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <Icon name={INDUSTRIES_FEATURED.icon} size={17} />
              </span>
              <span className="mb-1.5 block font-urbanist text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/50">
                {INDUSTRIES_FEATURED.eyebrow}
              </span>
              <span className="block font-urbanist text-[14px] font-medium leading-relaxed text-white/85">{INDUSTRIES_FEATURED.body}</span>
            </Link>
          </Nav.Link>
          <p className="mega-col-label mb-2.5 px-1">Popular verticals</p>
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRIES_POPULAR.map((c) => (
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
      <div className="mega-foot mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-3.5">
        <p className="font-urbanist text-[12.5px] text-ink-dim">
          <span className="font-semibold text-ink">{INDUSTRIES.length} industries</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-[#272b3d]/25 align-middle" aria-hidden />
          Built for high-growth digital teams
        </p>
        <div className="flex items-center gap-4">
          <Nav.Link asChild>
            <Link href="/case-studies" className="font-urbanist text-[13px] text-ink-dim transition-colors hover:text-ink">
              View Case Studies →
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link href="/industries" className="mega-foot-btn rounded-full px-4 py-2 font-urbanist text-[13px] font-semibold text-ink">
              Explore All Industries →
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
