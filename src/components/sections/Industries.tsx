"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bitcoin, Brain, Building2, Cloud, CreditCard, HeartPulse, Hotel, ShoppingCart, type LucideIcon } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import Image from "next/image";

/** solid accent, soft tint (icon tile), readable text shade, deep shade (scrim tint) */
type Tone = { solid: string; tint: string; text: string; deep: string };

/**
 * Industries: a 4 × 2 photo card grid (2 columns below lg).
 *
 *  · Every photo gets the same light grade and an ink scrim from the
 *    bottom (with a breath of the industry's tone), so the set reads as
 *    one family. Photos: Unsplash (free licence, no attribution required),
 *    in /public/media/industries/<slug>.jpg.
 *  · A frosted glass bar holds the icon tile, name and outcome. On mouse
 *    hover or keyboard focus the card lifts, the photo zooms slightly and
 *    the bar grows to show the summary and three systems.
 *  · Each card is one link to its industry page; touch screens have no
 *    hover, so a tap opens the page.
 */
type Industry = {
  name: string;
  icon: LucideIcon;
  outcome: string;
  summary: string;
  systems: string[];
  href: string;
  /** photo file in /public/media/industries (without .jpg) */
  image: string;
  tone: Tone;
};

const TONES = {
  violet: {
    solid: "#7c6cff",
    tint: "#f1eeff",
    text: "#4b3fb8",
    deep: "#5b4fd6",
  },
  pink: {
    solid: "#e96aa8",
    tint: "#fdeef5",
    text: "#a8326b",
    deep: "#b83a78",
  },
  indigo: {
    solid: "#5b6bff",
    tint: "#eef0ff",
    text: "#3a45b8",
    deep: "#3d4bd1",
  },
  amber: {
    solid: "#e0a030",
    tint: "#fdf5e3",
    text: "#8a5a0b",
    deep: "#96600f",
  },
  mint: {
    solid: "#34b48a",
    tint: "#e8f7f0",
    text: "#17714f",
    deep: "#16825c",
  },
  peach: {
    solid: "#f08a3e",
    tint: "#fff1e8",
    text: "#a4471a",
    deep: "#c2531c",
  },
  blue: {
    solid: "#4f9be0",
    tint: "#eaf3fd",
    text: "#1d5f9e",
    deep: "#1f6db3",
  },
  rose: {
    solid: "#f0708a",
    tint: "#fff0f3",
    text: "#a8324e",
    deep: "#bf3a57",
  },
} satisfies Record<string, Tone>;

/**
 * Order = what's most in demand right now: AI first, then healthcare,
 * finance and crypto, hospitality, real estate, commerce and SaaS.
 */
const INDUSTRIES: Industry[] = [
  {
    name: "Artificial Intelligence",
    icon: Brain,
    outcome: "AI people can trust",
    summary: "AI-native products, copilots, agents and search over your own data, designed so people understand and trust every answer.",
    systems: ["Copilots", "AI agents", "RAG search", "Automation"],
    href: "/industries/ai",
    image: "ai",
    tone: TONES.violet,
  },
  {
    name: "Healthcare",
    icon: HeartPulse,
    outcome: "Better care, less admin",
    summary: "Patient portals, telehealth, appointment booking, clinical dashboards and secure records, built with privacy in mind.",
    systems: ["Patient portal", "Telehealth", "Scheduling", "Records"],
    href: "/industries/healthcare",
    image: "healthcare",
    tone: TONES.rose,
  },
  {
    name: "FinTech",
    icon: CreditCard,
    outcome: "Trusted product and data flows",
    summary: "Secure workflows, data-heavy dashboards, onboarding journeys, reporting and integration-ready platforms.",
    systems: ["KYC", "Payments", "Reporting", "Security"],
    href: "/industries/fintech",
    image: "fintech",
    tone: TONES.mint,
  },
  {
    name: "Crypto & Web3",
    icon: Bitcoin,
    outcome: "Secure, simple Web3 experiences",
    summary: "Wallets, exchanges, token dashboards, on-chain analytics and onboarding that make crypto feel simple and safe.",
    systems: ["Wallets", "Exchange", "On-chain data", "Onboarding"],
    href: "/industries/crypto",
    image: "crypto",
    tone: TONES.amber,
  },
  {
    name: "Hospitality",
    icon: Hotel,
    outcome: "Stays that book themselves",
    summary: "Booking engines, guest apps, loyalty and membership journeys, and the operations dashboards behind every stay.",
    systems: ["Booking", "Guest app", "Loyalty", "Operations"],
    href: "/industries/travel",
    image: "hospitality",
    tone: TONES.peach,
  },
  {
    name: "Real Estate",
    icon: Building2,
    outcome: "Lead-to-listing clarity",
    summary: "Property portals, listing systems, lead routing, deal visibility, CRM sync and maintainable CMS workflows.",
    systems: ["Listings", "Lead routing", "CRM sync", "Portal"],
    href: "/industries/real-estate",
    image: "real-estate",
    tone: TONES.blue,
  },
  {
    name: "eCommerce",
    icon: ShoppingCart,
    outcome: "Fast stores, cleaner ops",
    summary: "Headless storefronts, Shopify and WooCommerce builds, checkout flows, subscriptions and owner-ready CMS.",
    systems: ["Storefront", "Checkout", "Subscriptions", "CMS"],
    href: "/industries/ecommerce",
    image: "ecommerce",
    tone: TONES.pink,
  },
  {
    name: "SaaS",
    icon: Cloud,
    outcome: "Retention-ready product systems",
    summary: "Dashboards, onboarding, billing, analytics and product workflows that scale past the first launch.",
    systems: ["MVP", "Billing", "Analytics", "Onboarding"],
    href: "/industries/saas",
    image: "saas",
    tone: TONES.indigo,
  },
];


const imageOf = (ind: Industry) => `/media/industries/${ind.image}.jpg`;

function IndustryCard({
  ind,
  index,
  open,
  onOpen,
  onClose,
  delay,
}: {
  ind: Industry;
  index: number;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  delay: number;
}) {
  const Icon = ind.icon;
  return (
    <li
      className="relative h-[240px] sm:h-[300px] lg:h-[340px]"
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onClose()}
    >
      <Reveal delay={delay} className="h-full">
        <Link
          href={ind.href}
          onFocus={onOpen}
          onBlur={onClose}
          aria-label={`${ind.name}: ${ind.outcome}`}
          className={`group/card relative block h-full overflow-hidden rounded-[22px] bg-[#0b0f19] shadow-[0_1px_2px_rgba(11,15,25,0.06)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "-translate-y-1 shadow-[0_28px_50px_-24px_rgba(11,15,25,0.55)]" : ""
          }`}
        >
          {/* photo: one shared grade so the set reads as one family */}
          <Image
            src={imageOf(ind)}
            alt=""
            fill
            sizes="(min-width: 1024px) 300px, 50vw"
            className={`object-cover saturate-[0.88] contrast-[1.04] transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "scale-[1.06]" : "scale-100"}`}
          />
          {/* scrim: soft ink shade from the bottom, a breath of the industry's tone, deeper when open */}
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: `linear-gradient(to top, rgba(11,15,25,0.72) 0%, rgba(11,15,25,0.28) 38%, rgba(11,15,25,0) 62%), linear-gradient(to top, ${ind.tone.deep}40, transparent 55%)` }}
          />
          <div
            aria-hidden
            className={`absolute inset-0 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to top, rgba(11,15,25,0.55) 0%, rgba(11,15,25,0.25) 60%, rgba(11,15,25,0.1) 100%)" }}
          />
          <span aria-hidden className="absolute inset-0 rounded-[22px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />

          {/* index */}
          <span
            aria-hidden
            className="absolute left-3 top-3 rounded-full border border-white/25 bg-white/15 px-2 py-0.5 font-urbanist text-[10.5px] font-semibold tabular-nums tracking-[0.08em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* glass bar: name + outcome; grows to show the story when open */}
          <div
            aria-hidden={!open}
            className="absolute inset-x-2.5 bottom-2.5 rounded-[16px] border border-white/20 bg-white/[0.1] p-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_10px_30px_-12px_rgba(11,15,25,0.5)] backdrop-blur-xl backdrop-saturate-150"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                style={{ background: ind.tone.tint, color: ind.tone.text }}
              >
                <Icon size={15} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <h3 className="truncate font-urbanist text-[14px] font-semibold tracking-[-0.005em] sm:text-[15px]">{ind.name}</h3>
                <p className="mt-0.5 hidden truncate font-urbanist text-[11px] text-white/70 sm:block">{ind.outcome}</p>
              </div>
              <span
                className={`hidden h-8 w-8 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-300 sm:grid ${
                  open ? "rotate-45 bg-white text-ink" : "bg-white/15 text-white"
                }`}
              >
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
              </span>
            </div>

            <div
              className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="mt-3 line-clamp-3 px-0.5 font-urbanist text-[12.5px] leading-snug text-white/85">{ind.summary}</p>
                <ul className="mt-2.5 flex flex-wrap gap-1 px-0.5 pb-0.5">
                  {ind.systems.slice(0, 3).map((s) => (
                    <li key={s} className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-urbanist text-[10.5px] font-medium text-white">
                      <span className="h-1 w-1 rounded-full" style={{ background: ind.tone.solid }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Link>
      </Reveal>
    </li>
  );
}

export default function Industries() {
  const [active, setActive] = useState(-1); // none open until hovered or focused

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24" aria-labelledby="industries-heading">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>Industries</SectionEyebrow>
                <SectionTitle id="industries-heading" className="max-w-[17ch] text-balance">
                  Built for the way your industry works.
                </SectionTitle>
                <SectionDescription className="mt-4 max-w-md">
                  Every industry runs on its own systems, approvals and customer journeys. We design and build around yours.
                </SectionDescription>
              </div>
              <Link
                href="/industries"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0b0f19]/10 bg-white px-4 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-colors hover:bg-[#f6f6f4]"
              >
                All industries
                <ArrowRight size={14} strokeWidth={1.9} aria-hidden />
              </Link>
            </div>
          </Reveal>

          <ul aria-label="Industries we serve" className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-4">
            {INDUSTRIES.map((ind, i) => (
                <IndustryCard
                  key={ind.name}
                  index={i}
                  delay={(i % 4) * 50}
                  ind={ind}
                  open={i === active}
                  onOpen={() => setActive(i)}
                  onClose={() => setActive((a) => (a === i ? -1 : a))}
                />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
