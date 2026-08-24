"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  ShoppingCart,
  Briefcase,
  Truck,
  CreditCard,
  Building2,
  Plane,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * Industries — rebuilt around the v2 reference site's own "Delivery Lens"
 * concept (a dark detail panel that updates to show the selected
 * industry's challenges and recommended service mix), which is where all
 * the content below comes from — real descriptive copy already written
 * for this exact set of 8 industries, just never wired into this v3
 * component. Nothing here is a fabricated metric; it's the same kind of
 * honest, descriptive content already used elsewhere (ServicePillars'
 * blurbs, DeliverySystem's steps).
 *
 * The dark aside panel reuses this site's existing "dark accent panel on
 * a light section" convention (same idea as EngagementModels' dark cards
 * or the black CTA pills elsewhere) rather than the reference's own
 * purple branding, so it reads as this site's language, not a reskin.
 *
 * Selecting a row (hover or click — both set the same state, so it works
 * for touch too) crossfades the panel's content via a small CSS keyframe
 * (`.lens-fade-in`, keyed by index so React remounts and replays it),
 * which is the section's "cool animation" beyond the standard Reveal
 * stagger — no GSAP needed for something this contained.
 */
type Industry = {
  name: string;
  icon: LucideIcon;
  description: string;
  challenges: string[];
  services: string[];
  tag: string;
  cta: string;
  href: string;
};

const INDUSTRIES: Industry[] = [
  {
    name: "SaaS",
    icon: Cloud,
    description: "MVPs, onboarding, dashboards, billing, analytics, and product systems built for retention.",
    challenges: ["Onboarding drop-off", "Messy integrations", "Slow feature delivery"],
    services: ["Product Engineering", "Experience Design", "AI & Automation"],
    tag: "Product engineering",
    cta: "Explore SaaS workflows",
    href: "/industries/saas",
  },
  {
    name: "eCommerce / Retail",
    icon: ShoppingCart,
    description: "Shopify, WooCommerce, headless storefronts, subscriptions, checkout, and owner-ready CMS operations.",
    challenges: ["Cart abandonment", "Slow storefront", "Fragmented inventory and operations"],
    services: ["Commerce Experiences", "Websites & Growth", "AI & Automation"],
    tag: "Conversion systems",
    cta: "Explore commerce workflows",
    href: "/industries/ecommerce",
  },
  {
    name: "Professional Services",
    icon: Briefcase,
    description: "Websites, portals, CRMs, proposal workflows, booking systems, and internal automation.",
    challenges: ["Manual approvals", "Document-heavy workflows", "Slow lead follow-up"],
    services: ["Websites & Growth", "AI & Automation", "Product Engineering"],
    tag: "Growth platforms",
    cta: "Explore service workflows",
    href: "/industries/professional-services",
  },
  {
    name: "Logistics",
    icon: Truck,
    description: "Tracking dashboards, dispatch tools, approval flows, reporting, and AI-assisted operations.",
    challenges: ["Tracking gaps", "Dispatch complexity", "Data spread across tools"],
    services: ["Product Engineering", "AI & Automation", "Integrations"],
    tag: "Workflow visibility",
    cta: "Explore logistics workflows",
    href: "/industries/logistics",
  },
  {
    name: "FinTech",
    icon: CreditCard,
    description: "Secure workflows, data-heavy dashboards, onboarding, reporting, and integration-ready platforms.",
    challenges: ["Onboarding friction", "Transaction visibility", "Secure workflow handling"],
    services: ["Product Engineering", "Experience Design", "Quality Standards"],
    tag: "Secure delivery",
    cta: "Explore FinTech workflows",
    href: "/industries/fintech",
  },
  {
    name: "Real Estate",
    icon: Building2,
    description: "Property portals, lead routing, deal visibility, listing systems, and maintainable CMS workflows.",
    challenges: ["Lead handling", "Agent workflows", "Listing and CRM sync"],
    services: ["Websites & Growth", "Product Engineering", "Integrations"],
    tag: "Portal systems",
    cta: "Explore real estate workflows",
    href: "/industries/real-estate",
  },
  {
    name: "Travel",
    icon: Plane,
    description: "Booking experiences, itinerary flows, vendor integrations, membership journeys, and premium CMS systems.",
    challenges: ["Booking UX", "Vendor integrations", "Trust-heavy decision flows"],
    services: ["Experience Design", "Websites & Growth", "Product Engineering"],
    tag: "Experience platforms",
    cta: "Explore travel workflows",
    href: "/industries/travel",
  },
  {
    name: "RMG",
    icon: Shirt,
    description: "Production tracking, inventory visibility, approval systems, reporting, and operational dashboards.",
    challenges: ["Manual tracking", "Approval delays", "Multi-branch visibility"],
    services: ["Product Engineering", "AI & Automation", "Reporting Systems"],
    tag: "Operations systems",
    cta: "Explore operations workflows",
    href: "/industries/rmg",
  },
];

const MORE = ["Luxury", "Nightlife", "Restaurant", "Marketplace", "Internal Operations", "B2B Platforms"];

export default function Industries() {
  const [active, setActive] = useState(0);
  const industry = INDUSTRIES[active];

  return (
    <section className="theme-light bg-light-surface py-16 lg:py-20" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
            Industries
          </p>
          <h2 id="industries-heading" className="font-urbanist text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Real industries, real workflows.
          </h2>
          <p className="mt-4 max-w-xl font-urbanist text-base leading-relaxed text-ink-dim">
            Same delivery standard, adapted to the workflows, integrations, and handover needs of each industry.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[320px_1fr] lg:gap-6">
          <Reveal className="lg:h-full">
            <aside className="flex h-full flex-col rounded-[28px] bg-ink p-7 text-white sm:p-8">
              <span className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Delivery lens</span>

              <div key={active} className="lens-fade-in mt-4 flex-1">
                <h3 className="font-urbanist text-xl font-bold leading-snug">{industry.name}</h3>
                <p className="mt-3 font-urbanist text-[13.5px] leading-relaxed text-white/65">{industry.description}</p>

                <ul className="mt-6 space-y-2.5">
                  {industry.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 font-urbanist text-[13px] leading-snug text-white/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aurora-amber" />
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <span className="font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">Recommended mix</span>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {industry.services.map((s) => (
                      <span key={s} className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 font-urbanist text-[11px] text-white/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={industry.href}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 font-urbanist text-[13px] font-semibold text-ink transition-transform duration-200 hover:scale-[1.03]"
              >
                {industry.cta}
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </aside>
          </Reveal>

          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              const isActive = i === active;
              return (
                <li key={ind.name}>
                  <Reveal delay={(i % 4) * 60} className="h-full">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`group flex h-full w-full items-start gap-4 rounded-2xl border p-5 text-left transition-[border-color,background-color] duration-200 ${
                        isActive ? "border-ink/15 bg-canvas-raised" : "border-hairline bg-canvas hover:border-ink/15 hover:bg-canvas-raised"
                      }`}
                    >
                      <span className="mega-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
                        <Icon size={18} strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-urbanist text-[11px] font-semibold text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                          <span className="font-urbanist text-[15px] font-bold text-ink">{ind.name}</span>
                        </span>
                        <span className="mt-1 block font-urbanist text-[12.5px] leading-snug text-ink-dim line-clamp-2">{ind.description}</span>
                      </span>
                      <ArrowRight
                        size={15}
                        strokeWidth={2}
                        className={`mt-1 shrink-0 transition-[transform,color] duration-200 ${isActive ? "translate-x-0.5 text-ink" : "text-ink-faint group-hover:translate-x-0.5 group-hover:text-ink"}`}
                      />
                    </button>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal delay={200}>
          <div className="mt-8 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="mr-1 font-urbanist text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">More industries</span>
              {MORE.map((m) => (
                <span key={m} className="rounded-full border border-hairline bg-canvas px-3 py-1.5 font-urbanist text-[12.5px] text-ink-dim">
                  {m}
                </span>
              ))}
            </div>
            <Link
              href="/industries"
              className="inline-flex shrink-0 items-center gap-2 font-urbanist text-sm font-semibold text-ink transition-colors duration-200 hover:text-aurora-violet"
            >
              Explore all industries
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
