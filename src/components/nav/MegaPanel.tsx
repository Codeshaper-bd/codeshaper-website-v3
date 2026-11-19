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
 * Services mega panel, the original 3-column structure in glass: How We
 * Engage (boxed, left), the 5 service groups (center), a featured AI card in
 * dark glass + quick-access chips (right), and a footer with two links.
 * Icons sit in neutral glass tiles and turn brand violet on hover
 * (globals.css "Mega menu").
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
                    <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]">
                      <Icon name={group.icon} size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="mega-row-name font-urbanist text-base font-semibold leading-snug text-ink">{group.name}</span>
                        {group.flagship && (
                          <span className="shrink-0 rounded-full bg-[#615fff]/10 px-1.5 py-px font-urbanist text-[10px] font-semibold leading-tight text-[#4f46e5]">
                            New
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate font-urbanist text-[13px] leading-snug text-ink-dim">
                        {groupDescriptor(group)}
                      </span>
                    </span>
                    <ArrowRight size={15} strokeWidth={1.75} className="mega-svc-arrow shrink-0 text-ink-faint" />
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
            <Link href={SERVICES_FEATURED.href} className="mega-feature-card group mb-5 block rounded-[20px] p-4">
              <span className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-[11px] bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <Icon name={SERVICES_FEATURED.icon} size={17} />
              </span>
              <span className="mb-1.5 block font-urbanist text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/50">
                {SERVICES_FEATURED.eyebrow}
              </span>
              <span className="block font-urbanist text-[17px] font-bold leading-tight tracking-tight text-white">
                {SERVICES_FEATURED.title}
              </span>
              <span className="mt-1.5 block font-urbanist text-[13.5px] leading-relaxed text-white/80">{SERVICES_FEATURED.desc}</span>
            </Link>
          </Nav.Link>
          <p className="mega-col-label mb-2.5 px-1">Quick access</p>
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
      <div className="mega-foot mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-3.5">
        <p className="font-urbanist text-[12.5px] text-ink-dim">
          <span className="font-semibold text-ink">{MEGA_MENU_FOOTER.count}</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-[#272b3d]/25 align-middle" aria-hidden />
          {MEGA_MENU_FOOTER.tagline}
        </p>
        <div className="flex items-center gap-4">
          <Nav.Link asChild>
            <Link href="/case-studies" className="font-urbanist text-[13px] text-ink-dim transition-colors hover:text-ink">
              View Case Studies →
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link href="/services" className="mega-foot-btn rounded-full px-4 py-2 font-urbanist text-[13px] font-semibold text-ink">
              Explore All Services →
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
