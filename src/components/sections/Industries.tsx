"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Cloud,
  CreditCard,
  Plane,
  Shirt,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

type Industry = {
  name: string;
  icon: LucideIcon;
  summary: string;
  outcome: string;
  systems: string[];
  href: string;
};

const INDUSTRIES: Industry[] = [
  {
    name: "SaaS",
    icon: Cloud,
    summary: "Dashboards, onboarding, billing, analytics, and product workflows that can scale past the first launch.",
    outcome: "Retention-ready product systems",
    systems: ["MVP", "Billing", "Analytics"],
    href: "/industries/saas",
  },
  {
    name: "eCommerce",
    icon: ShoppingCart,
    summary: "Headless storefronts, Shopify/WooCommerce builds, checkout flows, subscriptions, and owner-ready CMS operations.",
    outcome: "Fast storefronts and cleaner ops",
    systems: ["Storefront", "Checkout", "CMS"],
    href: "/industries/ecommerce",
  },
  {
    name: "Professional Services",
    icon: Briefcase,
    summary: "Premium websites, portals, CRM workflows, proposal flows, booking systems, and internal automation.",
    outcome: "Sharper lead and delivery flow",
    systems: ["CRM", "Portal", "Automation"],
    href: "/industries/professional-services",
  },
  {
    name: "Logistics",
    icon: Truck,
    summary: "Tracking dashboards, dispatch tools, approval flows, route visibility, reporting, and AI-assisted operations.",
    outcome: "Operational visibility in motion",
    systems: ["Dispatch", "Tracking", "Reports"],
    href: "/industries/logistics",
  },
  {
    name: "FinTech",
    icon: CreditCard,
    summary: "Secure workflows, data-heavy dashboards, onboarding journeys, reporting, and integration-ready platforms.",
    outcome: "Trusted product and data flows",
    systems: ["KYC", "Data", "Security"],
    href: "/industries/fintech",
  },
  {
    name: "Real Estate",
    icon: Building2,
    summary: "Property portals, listing systems, lead routing, deal visibility, CRM sync, and maintainable CMS workflows.",
    outcome: "Lead-to-listing clarity",
    systems: ["Listings", "CRM", "Portal"],
    href: "/industries/real-estate",
  },
  {
    name: "Travel",
    icon: Plane,
    summary: "Booking experiences, itinerary flows, vendor integrations, membership journeys, and premium CMS systems.",
    outcome: "Premium planning experiences",
    systems: ["Booking", "Vendors", "Membership"],
    href: "/industries/travel",
  },
  {
    name: "RMG",
    icon: Shirt,
    summary: "Production tracking, inventory visibility, approval systems, reporting, and operational dashboards.",
    outcome: "Cleaner production control",
    systems: ["Inventory", "Approvals", "Dashboards"],
    href: "/industries/rmg",
  },
];

export default function Industries() {
  const [active, setActive] = useState(0);
  const activeIndustry = INDUSTRIES[active];
  const ActiveIcon = activeIndustry.icon;

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section
        className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24"
        aria-labelledby="industries-heading"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>Industries</SectionEyebrow>
              <SectionTitle id="industries-heading" className="max-w-md">
                Industry-specific workflows, built with real product taste.
              </SectionTitle>
            </div>
            <div className="flex items-center gap-4">
              <SectionDescription className="max-w-xs">
                Adapted to what makes each business different: integrations, approvals, journeys, and handover.
              </SectionDescription>
              <Link
                href="/industries"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Explore all
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-5">
          <Reveal className="lg:h-full">
            <aside className="relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[24px] bg-ink p-6 text-white">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_76%_14%,rgba(255,255,255,0.12),transparent_30%)]" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 font-urbanist text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
                    Active focus
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white">
                    <ActiveIcon size={17} strokeWidth={1.6} />
                  </span>
                </div>

                <div key={active} className="lens-fade-in mt-auto pt-8">
                  <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {activeIndustry.outcome}
                  </p>
                  <h3 className="mt-2.5 font-urbanist text-2xl font-bold leading-tight tracking-tight">
                    {activeIndustry.name}
                  </h3>
                  <p className="mt-3 font-urbanist text-[13px] leading-relaxed text-white/65 line-clamp-3">
                    {activeIndustry.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {activeIndustry.systems.map((system) => (
                      <span key={system} className="rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-1 font-urbanist text-[11px] text-white/80">
                        {system}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={activeIndustry.href}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-urbanist text-[12.5px] font-semibold text-ink transition-transform duration-300 hover:scale-[1.02]"
                  >
                    View workflow
                    <ArrowRight size={13} strokeWidth={1.75} />
                  </Link>
                </div>
              </div>
            </aside>
          </Reveal>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((industry, i) => {
              const Icon = industry.icon;
              const isActive = i === active;
              return (
                <li key={industry.name}>
                  <Reveal delay={(i % 4) * 45} className="h-full">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`group relative flex h-full min-h-[142px] w-full flex-col overflow-hidden rounded-[20px] border p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 ${
                        isActive
                          ? "border-ink/15 bg-canvas shadow-[0_14px_36px_rgba(11,15,25,0.08)]"
                          : "border-hairline bg-[#fafafa] hover:-translate-y-0.5 hover:border-ink/15 hover:bg-canvas"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className={`mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isActive ? "text-ink" : "text-aurora-indigo"}`}>
                          <Icon size={16} strokeWidth={1.75} />
                        </span>
                        <ArrowRight
                          size={14}
                          strokeWidth={1.75}
                          className={`mt-1 shrink-0 transition-[transform,color,opacity] duration-200 ${
                            isActive ? "translate-x-0.5 text-ink opacity-100" : "text-ink-faint opacity-60 group-hover:translate-x-0.5 group-hover:text-ink group-hover:opacity-100"
                          }`}
                        />
                      </div>
                      <h3 className="mt-3.5 font-urbanist text-[14.5px] font-bold leading-tight text-ink">{industry.name}</h3>
                      <p className="mt-1.5 line-clamp-2 font-urbanist text-[11.5px] leading-snug text-ink-dim">{industry.summary}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                        <span className="rounded-full bg-canvas-raised px-2 py-0.5 font-urbanist text-[10px] text-ink-dim">
                          {industry.systems[0]}
                        </span>
                      </div>
                    </button>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
        </div>
      </section>
    </div>
  );
}
