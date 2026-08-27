"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { INDUSTRIES, INDUSTRIES_POPULAR, INDUSTRIES_FEATURED } from "@/lib/navigation";
import { Icon } from "@/lib/icons";
import EngageCard from "./EngageCard";

/**
 * Industries mega panel — same 3-column shell as Services. Left: How We
 * Engage (shared). Center: a 2-column grid of the 10 industries. Right: a
 * dark case-study card + popular-vertical chips. Footer: count + two links.
 */
export default function IndustriesMegaPanel() {
  return (
    <div className="mx-auto max-w-[1180px] p-5">
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
                    <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
                      <Icon name={ind.icon} size={16} />
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="mega-row-name block font-urbanist text-base font-semibold leading-snug text-ink transition-colors duration-150">
                        {ind.label}
                      </span>
                      <span className="mt-0.5 block font-urbanist text-[12.5px] leading-snug text-ink-dim">
                        {ind.desc}
                      </span>
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
            <Link href={INDUSTRIES_FEATURED.href} className="mega-feature-card group mb-5 block rounded-2xl p-4">
              <span className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.12] text-white">
                <Icon name={INDUSTRIES_FEATURED.icon} size={17} />
              </span>
              <span className="mb-1.5 block font-urbanist text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/50">
                {INDUSTRIES_FEATURED.eyebrow}
              </span>
              <span className="block font-urbanist text-[14px] font-medium leading-relaxed text-white/90">
                {INDUSTRIES_FEATURED.body}
              </span>
            </Link>
          </Nav.Link>
          <p className="menu-section-label font-urbanist mb-2.5 px-1">Popular verticals</p>
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
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-canvas-raised px-5 py-3.5">
        <p className="font-urbanist text-[12.5px] text-ink-dim">
          <span className="font-semibold text-ink">10 industries</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-hairline-strong align-middle" aria-hidden />
          Built for high-growth digital teams
        </p>
        <div className="flex items-center gap-4">
          <Nav.Link asChild>
            <Link href="/case-studies" className="font-urbanist text-[13px] text-ink-dim transition-colors hover:text-ink">
              View Case Studies →
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link
              href="/industries"
              className="rounded-full border border-aurora-indigo/30 bg-aurora-indigo/5 px-4 py-2 font-urbanist text-[13px] font-semibold text-aurora-violet transition-colors hover:border-aurora-violet hover:bg-aurora-violet hover:text-white"
            >
              Explore All Industries →
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
