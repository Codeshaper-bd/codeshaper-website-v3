"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { SERVICE_GROUPS, SERVICES_FEATURED, MEGA_MENU_FOOTER, groupDescriptor, servicePath } from "@/data/services";
import { Icon } from "@/lib/icons";
import EngageCard from "./EngageCard";
import { tone } from "./tones";

/**
 * Services mega panel: compact, glass (globals.css "Nav glass details").
 * Three zones: How we engage (a glass box, left), the 5 service groups
 * (one-line descriptor each), and a featured AI card in dark glass. A slim glass
 * footer with one quiet link and one button. The quick-access chips were
 * dropped: they repeated links already in the list.
 */
export default function MegaPanel() {
  return (
    <div className="p-2.5">
      <div className="grid grid-cols-[1fr_1.25fr_236px] gap-2">
        <EngageCard />

        {/* Services */}
        <div className="menu-col min-w-0 p-1.5">
          <p className="mega-col-label mb-2 px-2">Services</p>
          <ul>
            {SERVICE_GROUPS.map((group, i) => (
              <li key={group.slug}>
                <Nav.Link asChild>
                  <Link href={servicePath(group.slug)} className="mega-row group flex items-center gap-3 px-2 py-2">
                    <span className="mega-icon-tile flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]" style={tone(i)}>
                      <Icon name={group.icon} size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="mega-row-name truncate font-urbanist text-[14.5px] font-semibold leading-tight text-ink">
                          {group.name}
                        </span>
                        {group.flagship && (
                          <span className="shrink-0 rounded-full bg-[#615fff]/10 px-1.5 py-px font-urbanist text-[10px] font-semibold leading-tight text-[#4f46e5]">
                            New
                          </span>
                        )}
                      </span>
                      <span className="mt-px block truncate font-urbanist text-[12px] leading-snug text-ink-dim">
                        {groupDescriptor(group)}
                      </span>
                    </span>
                    <ArrowRight size={14} strokeWidth={1.75} className="mega-svc-arrow shrink-0 text-ink-faint" />
                  </Link>
                </Nav.Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured, dark glass */}
        <div className="menu-col p-1">
          <Nav.Link asChild>
            <Link href={SERVICES_FEATURED.href} className="mega-feature-card group flex h-full flex-col rounded-[18px] p-4">
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <Icon name={SERVICES_FEATURED.icon} size={15} />
              </span>
              <span className="mb-1 block font-urbanist text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                {SERVICES_FEATURED.eyebrow}
              </span>
              <span className="block font-urbanist text-[16px] font-bold leading-tight tracking-tight text-white">
                {SERVICES_FEATURED.title}
              </span>
              <span className="mt-1.5 block font-urbanist text-[12.5px] leading-relaxed text-white/75">{SERVICES_FEATURED.desc}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 font-urbanist text-[12.5px] font-semibold text-white">
                Learn more
                <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Nav.Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mega-foot mt-2 flex items-center justify-between gap-4 rounded-[14px] px-3.5 py-2">
        <p className="font-urbanist text-[12px] text-ink-dim">
          <span className="font-semibold text-ink">{MEGA_MENU_FOOTER.count}</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-[#0b0f19]/20 align-middle" aria-hidden />
          {MEGA_MENU_FOOTER.tagline}
        </p>
        <div className="flex items-center gap-3">
          <Nav.Link asChild>
            <Link href="/case-studies" className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink">
              Case studies
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link href="/services" className="mega-foot-btn inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 font-urbanist text-[12.5px] font-semibold text-ink">
              All services
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
