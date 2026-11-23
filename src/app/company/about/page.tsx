import type { Metadata } from "next";
import { mainMeta } from "@/lib/mainPages";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { SERVICE_GROUPS, ENGAGEMENT_MODELS, servicePath } from "@/data/services";
import { Icon } from "@/lib/icons";
import HeroBackdrop from "@/components/system/HeroBackdrop";
import DotField from "@/components/sections/human-ai-flow/DotField";

export const metadata: Metadata = mainMeta("about", {
  title: "About",
  description:
    "CodeShaper is an AI engineering & software development company building reliable, production-ready AI and software that integrates with your existing tools.",
  alternates: { canonical: "/company/about" },
});

/**
 * Stats reused from AboutStudio.tsx (the homepage "who we are" section) —
 * same source, same discipline: every number here is an actual structural
 * count already established elsewhere in the codebase (SERVICE_GROUPS,
 * INDUSTRIES, Locations' REGIONS), not an invented headcount or founding
 * year. Kept in sync manually since this page and the homepage section
 * serve different layouts.
 */
const STATS = [
  { value: String(SERVICE_GROUPS.length), label: "Service groups" },
  { value: "10", label: "Industries served" },
  { value: "16+", label: "Clients worldwide" },
  { value: "4", label: "Regions covered" },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
      <section className="page-hero theme-light relative isolate overflow-hidden rounded-b-[28px] sm:rounded-b-[32px] bg-canvas pb-16 pt-32 lg:pb-20 lg:pt-36">
        <HeroBackdrop />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 [&>*]:max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Company" }, { label: "About" }]} />
          <SectionEyebrow>Company</SectionEyebrow>
          <SectionTitle as="h1" size="lg">
            AI engineering &amp; software development, under one roof.
          </SectionTitle>
          <SectionDescription className="mt-5">
            CodeShaper is an AI engineering &amp; software development company. We build reliable, production-ready
            AI and software systems that integrate with the tools you already use — with human approval, logging,
            testing, and monitoring built in, and a clean handover at the end of every engagement.
          </SectionDescription>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-hairline py-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 font-urbanist text-[13px] text-ink-dim">{s.label}</dt>
                <dd className="font-urbanist text-3xl font-bold tracking-tight text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      </div>

      <section className="theme-light relative overflow-clip bg-light-surface py-16 lg:py-24">
        <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <p className="mb-6 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
            What we do
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_GROUPS.map((group) => (
              <Link
                key={group.slug}
                href={servicePath(group.slug)}
                className="group flex items-start gap-3 rounded-[18px] border border-[#0b0f19]/[0.07] bg-white shadow-[0_1px_2px_rgba(11,15,25,0.03)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#0b0f19]/[0.12] hover:shadow-[0_18px_40px_-28px_rgba(11,15,25,0.35)] p-5"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-dim">
                  <Icon name={group.icon} size={16} />
                </span>
                <span>
                  <span className="block font-urbanist text-[14px] font-semibold text-ink">{group.name}</span>
                  <span className="mt-0.5 block font-urbanist text-[12.5px] leading-relaxed text-ink-dim">{group.focus}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
      <section className="theme-light rounded-[28px] bg-canvas py-16 sm:rounded-[32px] lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="mb-6 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
            How we work
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENGAGEMENT_MODELS.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className="flex h-full items-center justify-between gap-3 rounded-[16px] border border-[#0b0f19]/[0.07] bg-[#fafaf9] px-5 py-4 transition-[border-color,background-color] duration-300 hover:border-[#0b0f19]/[0.14] hover:bg-white"
                >
                  <span className="font-urbanist text-[14px] font-medium text-ink">{m.label}</span>
                  <span className="font-urbanist text-[12.5px] text-ink-faint">{m.desc}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#0b0f19] px-6 py-3 font-urbanist text-sm font-semibold text-white transition-colors hover:bg-[#1f2433]"
          >
            Book a call
            <ArrowRight size={15} strokeWidth={1.75} />
          </Link>
        </div>
      </section>
      </div>
    </SiteShell>
  );
}
