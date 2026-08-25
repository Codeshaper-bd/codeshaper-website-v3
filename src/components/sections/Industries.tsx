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
    <section className="theme-light bg-light-surface py-16 lg:py-24" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
                Industries
              </p>
              <h2 id="industries-heading" className="font-urbanist text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
                Industry workflows, built with product taste.
              </h2>
            </div>
            <div className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-xl font-urbanist text-base leading-relaxed text-ink-dim lg:text-right">
                We adapt the same delivery system to the practical details that make each business different: integrations, approvals, customer journeys, reporting, and handover.
              </p>
              <Link
                href="/industries"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-aurora-violet px-6 py-3 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Explore all industries
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:gap-6">
          <Reveal className="lg:h-full">
            <aside className="relative flex h-full min-h-[430px] overflow-hidden rounded-[32px] bg-ink p-7 text-white sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_76%_14%,rgba(255,255,255,0.12),transparent_30%)]" />
              <div className="relative flex h-full w-full flex-col">
                <div className="flex items-start justify-between gap-5">
                  <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    Active focus
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-white">
                    <ActiveIcon size={21} strokeWidth={1.6} />
                  </span>
                </div>

                <div key={active} className="lens-fade-in mt-auto pt-16">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    {activeIndustry.outcome}
                  </p>
                  <h3 className="mt-4 font-urbanist text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    {activeIndustry.name}
                  </h3>
                  <p className="mt-4 max-w-md font-urbanist text-[14.5px] leading-relaxed text-white/68">
                    {activeIndustry.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeIndustry.systems.map((system) => (
                      <span key={system} className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 font-urbanist text-[12px] text-white/80">
                        {system}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={activeIndustry.href}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-urbanist text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.02]"
                  >
                    View workflow
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </Link>
                </div>
              </div>
            </aside>
          </Reveal>

          <ul className="grid gap-3 sm:grid-cols-2">
            {INDUSTRIES.map((industry, i) => {
              const Icon = industry.icon;
              const isActive = i === active;
              return (
                <li key={industry.name}>
                  <Reveal delay={(i % 4) * 55} className="h-full">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`group relative flex h-full min-h-[164px] w-full flex-col overflow-hidden rounded-[24px] border p-5 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 ${
                        isActive
                          ? "border-ink/15 bg-canvas shadow-[0_18px_50px_rgba(11,15,25,0.08)]"
                          : "border-hairline bg-canvas/80 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-canvas"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className={`mega-icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isActive ? "text-ink" : "text-aurora-indigo"}`}>
                          <Icon size={19} strokeWidth={1.75} />
                        </span>
                        <ArrowRight
                          size={16}
                          strokeWidth={1.75}
                          className={`mt-1 shrink-0 transition-[transform,color,opacity] duration-200 ${
                            isActive ? "translate-x-0.5 text-ink opacity-100" : "text-ink-faint opacity-60 group-hover:translate-x-0.5 group-hover:text-ink group-hover:opacity-100"
                          }`}
                        />
                      </div>
                      <h3 className="mt-5 font-urbanist text-[18px] font-bold leading-tight text-ink">{industry.name}</h3>
                      <p className="mt-2 line-clamp-2 font-urbanist text-[13px] leading-relaxed text-ink-dim">{industry.summary}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                        {industry.systems.slice(0, 2).map((system) => (
                          <span key={system} className="rounded-full bg-canvas-raised px-2.5 py-1 font-urbanist text-[11px] text-ink-dim">
                            {system}
                          </span>
                        ))}
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
  );
}
