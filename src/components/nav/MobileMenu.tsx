"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ArrowRight, Plus } from "lucide-react";
import { SERVICE_COLUMNS, SIMPLE_MENUS } from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";

/**
 * Mobile navigation (<1024px): existing full-screen takeover + Radix Accordion,
 * now with the service icon on each accordion header (Step 3) and the promo
 * card at the bottom of the Services accordion.
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
      className={`fixed inset-0 top-16 z-40 overflow-y-auto bg-canvas transition-opacity duration-300 lg:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <nav aria-label="Mobile" className="px-6 py-8">
        <p className="mb-4 menu-section-label font-body">
          Services
        </p>
        <Accordion.Root type="single" collapsible className="border-t border-hairline">
          {SERVICE_COLUMNS.map((col) => (
            <Accordion.Item key={col.id} value={col.id} className="border-b border-hairline">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 py-4 text-left">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hairline bg-canvas-raised text-aurora-indigo">
                      <Icon name={SERVICE_ICONS[col.id]} size={18} />
                    </span>
                    <span className="font-display text-base font-medium text-ink">
                      <span className="mr-2 text-sm text-light-dim">{col.number}</span>
                      {col.title}
                      {col.flagship && (
                        <span className="ml-2 rounded-full border border-hairline px-1.5 py-px font-body text-[10px] text-aurora-amber">
                          New
                        </span>
                      )}
                    </span>
                  </span>
                  <Plus
                    size={16}
                    strokeWidth={1.5}
                    className="shrink-0 text-ink-dim transition-transform duration-300 group-data-[state=open]:rotate-45"
                    aria-hidden
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden">
                <ul className="pb-4">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={onClose}
                        className="block py-2 pl-12 font-body text-sm text-ink-dim"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        {/* Promo card at the bottom of the Services accordion */}
        <Link
          href="/work"
          onClick={onClose}
          className="glass mt-6 block overflow-hidden rounded-xl"
        >
          <div
            className="aspect-[16/9] w-full"
            aria-hidden
            style={{ background: "linear-gradient(135deg, #667EEA 0%, #44549B 55%, #14B8A6 100%)" }}
          />
          <div className="p-5">
            <p className="menu-section-label font-body">
              Case study
            </p>
            <p className="mt-2 font-display text-[28px] font-bold leading-none text-ink">+38%</p>
            <p className="mt-2 font-body text-[13px] leading-relaxed text-ink-dim">
              faster order flow after a commerce rebuild
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 font-body text-[13px] text-aurora-indigo">
              Read the story
              <ArrowRight size={14} strokeWidth={1.75} />
            </span>
          </div>
        </Link>

        <div className="mt-10 space-y-8">
          <Link href="/work" onClick={onClose} className="block font-display text-lg font-medium text-ink">
            Work
          </Link>
          {SIMPLE_MENUS.map((m) => (
            <div key={m.id}>
              <p className="mb-3 menu-section-label font-body">
                {m.label}
              </p>
              <ul className="space-y-1">
                {m.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="flex items-center gap-3 py-1.5 font-body text-sm text-ink-dim"
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

        <div className="mt-12 pb-16">
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-block rounded-full bg-aurora-indigo px-6 py-3 font-display text-sm font-medium text-white"
          >
            Book a Call
          </Link>
        </div>
      </nav>
    </div>
  );
}
