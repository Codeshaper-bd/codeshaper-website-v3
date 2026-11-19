"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { INDUSTRIES, INDUSTRIES_POPULAR, INDUSTRIES_FEATURED } from "@/lib/navigation";
import { Icon } from "@/lib/icons";
import EngageCard from "./EngageCard";
import { tone } from "./tones";

/**
 * Industries mega panel: compact, glass (same language as Services). The
 * How we engage (the shared glass box, left), the industries in a tidy
 * 2-column grid (icon, name, one-line note), and a dark-glass case-study
 * card with the popular verticals.
 */
export default function IndustriesMegaPanel() {
  return (
    <div className="p-2.5">
      <div className="grid grid-cols-[0.82fr_1.5fr_236px] gap-2">
        <EngageCard />

        <div className="menu-col min-w-0 p-1.5">
          <p className="mega-col-label mb-2 px-2">Industries we serve</p>
          <ul className="grid grid-cols-2 gap-x-1">
            {INDUSTRIES.map((ind, i) => (
              <li key={ind.href}>
                <Nav.Link asChild>
                  <Link href={ind.href} className="mega-row group flex items-center gap-2.5 px-2 py-[7px]">
                    <span className="mega-icon-tile flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]" style={tone(i)}>
                      <Icon name={ind.icon} size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="mega-row-name block truncate font-urbanist text-[14.5px] font-semibold leading-tight text-ink">
                        {ind.label}
                      </span>
                      <span className="block truncate font-urbanist text-[12px] leading-snug text-ink-dim">{ind.desc}</span>
                    </span>
                  </Link>
                </Nav.Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="menu-col flex flex-col gap-3 p-1">
          <Nav.Link asChild>
            <Link href={INDUSTRIES_FEATURED.href} className="mega-feature-card group block rounded-[18px] p-4">
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <Icon name={INDUSTRIES_FEATURED.icon} size={15} />
              </span>
              <span className="mb-1 block font-urbanist text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                {INDUSTRIES_FEATURED.eyebrow}
              </span>
              <span className="block font-urbanist text-[13px] font-medium leading-relaxed text-white/85">{INDUSTRIES_FEATURED.body}</span>
              <span className="mt-3 inline-flex items-center gap-1 font-urbanist text-[12.5px] font-semibold text-white">
                Read the case study
                <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Nav.Link>
          <div className="px-1">
            <p className="mega-col-label mb-2 px-1">Popular</p>
            <div className="flex flex-wrap gap-1.5">
              {INDUSTRIES_POPULAR.map((c) => (
                <Nav.Link asChild key={c.href}>
                  <Link href={c.href} className="mega-chip inline-flex items-center rounded-full px-2.5 py-1 font-urbanist text-[12px] font-semibold">
                    {c.label}
                  </Link>
                </Nav.Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mega-foot mt-2 flex items-center justify-between gap-4 rounded-[14px] px-3.5 py-2">
        <p className="font-urbanist text-[12px] text-ink-dim">
          <span className="font-semibold text-ink">{INDUSTRIES.length} industries</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-[#0b0f19]/20 align-middle" aria-hidden />
          Built for high-growth digital teams
        </p>
        <div className="flex items-center gap-3">
          <Nav.Link asChild>
            <Link href="/case-studies" className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink">
              Case studies
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link href="/industries" className="mega-foot-btn inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 font-urbanist text-[12.5px] font-semibold text-ink">
              All industries
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
