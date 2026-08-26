import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { SERVICE_COLUMNS, ENGAGEMENT_MODELS } from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "CodeShaper is a digital product studio combining design, engineering, commerce, and AI automation under one roof — with weekly visibility and clean handover.",
  alternates: { canonical: "/company/about" },
};

/**
 * Stats reused from AboutStudio.tsx (the homepage "who we are" section) —
 * same source, same discipline: every number here is an actual structural
 * count already established elsewhere in the codebase (SERVICE_COLUMNS,
 * INDUSTRIES, Locations' REGIONS), not an invented headcount or founding
 * year. Kept in sync manually since this page and the homepage section
 * serve different layouts.
 */
const STATS = [
  { value: "5", label: "Core practices" },
  { value: "10", label: "Industries served" },
  { value: "16+", label: "Clients worldwide" },
  { value: "3", label: "Regions covered" },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="bg-canvas py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Company" }, { label: "About" }]} />
          <SectionEyebrow>Company</SectionEyebrow>
          <SectionTitle as="h1" size="lg">
            Design, engineering, and AI — under one roof.
          </SectionTitle>
          <SectionDescription className="mt-5">
            CodeShaper is a digital product studio combining design, engineering, commerce, and AI automation under
            one roof — with weekly visibility and a clean handover at the end of every engagement.
          </SectionDescription>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-hairline py-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-urbanist text-3xl font-bold tracking-tight text-ink">{s.value}</dd>
                <p className="mt-1 font-urbanist text-[13px] text-ink-dim">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-hairline bg-canvas-raised py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="mb-6 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
            What we do
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICE_COLUMNS.map((col) => (
              <Link
                key={col.id}
                href={col.href}
                className="group flex items-start gap-3 rounded-xl border border-hairline p-4 transition-colors duration-300 hover:border-aurora-violet/50"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-dim">
                  <Icon name={SERVICE_ICONS[col.id]} size={16} />
                </span>
                <span>
                  <span className="block font-urbanist text-[14px] font-semibold text-ink">{col.title}</span>
                  <span className="mt-0.5 block font-urbanist text-[12.5px] leading-relaxed text-ink-dim">{col.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-canvas py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="mb-6 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
            How we work
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ENGAGEMENT_MODELS.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className="flex items-center justify-between gap-3 rounded-xl border border-hairline px-4 py-3 transition-colors duration-300 hover:border-aurora-violet/50"
                >
                  <span className="font-urbanist text-[14px] font-medium text-ink">{m.label}</span>
                  <span className="font-urbanist text-[12.5px] text-ink-faint">{m.desc}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-aurora-violet/70 px-6 py-3 font-urbanist text-sm font-semibold text-ink transition-colors hover:border-aurora-violet"
          >
            Book a call
            <ArrowRight size={15} strokeWidth={1.75} />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
