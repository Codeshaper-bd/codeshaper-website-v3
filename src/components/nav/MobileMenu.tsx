"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ArrowRight, Plus } from "lucide-react";
import {
  SERVICE_COLUMNS,
  SIMPLE_MENUS,
  ENGAGEMENT_MODELS,
  SERVICES_QUICK_ACCESS,
  SERVICES_FEATURED,
  INDUSTRIES,
} from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";

/**
 * Mobile navigation (<1024px): full-screen takeover + Radix Accordion.
 * The Services accordion is sub-grouped (How We Engage / Core Services /
 * Featured / Quick Access) to mirror the desktop mega menu's content, not
 * just a flat sub-service list. Industries gets its own accordion.
 */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 top-[84px] z-40 overflow-y-auto bg-canvas transition-opacity duration-300 sm:top-[92px] lg:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <nav aria-label="Mobile" className="px-6 py-8">
        <Link href="/" onClick={onClose} className="block py-4 font-urbanist text-base font-medium text-ink">
          Home
        </Link>

        <Accordion.Root type="single" collapsible className="border-t border-hairline">
          {/* Services */}
          <Accordion.Item value="services" className="border-b border-hairline">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 py-4 text-left font-urbanist text-base font-medium text-ink">
                Services
                <Plus
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0 text-ink-dim transition-transform duration-300 group-data-[state=open]:rotate-45"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden pb-5">
              <p className="menu-section-label mb-2 mt-1 font-urbanist">How We Engage</p>
              <ul className="mb-4">
                {ENGAGEMENT_MODELS.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} onClick={onClose} className="block py-2 font-urbanist text-sm text-ink-dim">
                      {m.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="menu-section-label mb-2 font-urbanist">Core Services</p>
              <ul className="mb-4">
                {SERVICE_COLUMNS.map((col) => (
                  <li key={col.id}>
                    <Link
                      href={col.href}
                      onClick={onClose}
                      className="flex items-center gap-3 py-2 font-urbanist text-sm text-ink-dim"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-hairline bg-canvas-raised text-aurora-indigo">
                        <Icon name={SERVICE_ICONS[col.id]} size={14} />
                      </span>
                      {col.title}
                      {col.flagship && (
                        <span className="rounded-full border border-hairline px-1.5 py-px font-urbanist text-[10px] text-aurora-amber-dark">
                          New
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="menu-section-label mb-2 font-urbanist">Featured</p>
              <Link
                href={SERVICES_FEATURED.href}
                onClick={onClose}
                className="mb-4 block rounded-xl border border-hairline bg-canvas-raised p-4"
              >
                <p className="font-urbanist text-[15px] font-semibold text-ink">{SERVICES_FEATURED.title}</p>
                <p className="mt-1 font-urbanist text-[13px] leading-relaxed text-ink-dim">{SERVICES_FEATURED.desc}</p>
              </Link>

              <p className="menu-section-label mb-2 font-urbanist">Quick Access</p>
              <div className="flex flex-wrap gap-2">
                {SERVICES_QUICK_ACCESS.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={onClose}
                    className="mega-chip inline-flex items-center rounded-full px-3 py-1.5 font-urbanist text-xs font-semibold"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>

          {/* Industries */}
          <Accordion.Item value="industries" className="border-b border-hairline">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 py-4 text-left font-urbanist text-base font-medium text-ink">
                Industries
                <Plus
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0 text-ink-dim transition-transform duration-300 group-data-[state=open]:rotate-45"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden pb-5">
              <ul>
                {INDUSTRIES.map((ind) => (
                  <li key={ind.href}>
                    <Link href={ind.href} onClick={onClose} className="block py-2 font-urbanist text-sm text-ink-dim">
                      {ind.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/industries"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-1.5 font-urbanist text-[13px] font-semibold text-aurora-violet"
              >
                Explore All Industries
                <ArrowRight size={13} strokeWidth={1.75} />
              </Link>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Link
          href="/work"
          onClick={onClose}
          className="block border-b border-hairline py-4 font-urbanist text-base font-medium text-ink"
        >
          Success Stories
        </Link>

        <div className="mt-6 space-y-8">
          {SIMPLE_MENUS.map((m) => (
            <div key={m.id}>
              <p className="mb-3 menu-section-label font-urbanist">{m.label}</p>
              <ul className="space-y-1">
                {m.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="flex items-center gap-3 py-1.5 font-urbanist text-sm text-ink-dim"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-hairline bg-canvas-raised text-aurora-indigo">
                        <Icon name={l.icon} size={14} />
                      </span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 pb-16 sm:flex-row">
          <Link
            href="/work"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-aurora-indigo/25 px-6 py-3 font-urbanist text-sm font-medium text-ink-dim transition-colors hover:border-aurora-indigo/45 hover:text-ink"
          >
            View Work
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-aurora-violet px-6 py-3 font-urbanist text-sm font-medium text-white transition-colors duration-300 hover:bg-aurora-violet-dark"
          >
            Book a Call
          </Link>
        </div>
      </nav>
    </div>
  );
}
