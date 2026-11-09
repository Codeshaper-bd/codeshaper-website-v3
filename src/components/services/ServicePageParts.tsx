import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Breadcrumbs, { type Crumb } from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { Icon } from "@/lib/icons";
import { servicePath, type Service } from "@/data/services";
import { SITE_URL } from "@/lib/site";

/**
 * Building blocks shared by every page under /services/* — the AI Agents
 * & Automation flagship page, the generic group pages, and the service
 * detail template. Each block is lifted verbatim (markup + classes) from
 * the original bespoke AI pillar page, so all service pages share one
 * visual language instead of each re-declaring it.
 */

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{children}</p>;
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** BreadcrumbList JSON-LD from the same crumbs the visible breadcrumb renders. */
export function breadcrumbJsonLd(crumbs: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.href === "/" ? SITE_URL : `${SITE_URL}${c.href}`,
    })),
  };
}

type CtaLink = { label: string; href: string };

export function ServicesHero({
  id,
  breadcrumbs,
  icon,
  eyebrow,
  title,
  intro,
  primary,
  secondary,
}: {
  id: string;
  breadcrumbs: Crumb[];
  icon: string;
  eyebrow: string;
  title: string;
  intro: string;
  primary: CtaLink;
  secondary?: CtaLink;
}) {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <Reveal distance={0}>
        <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby={id}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.16), transparent)" }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <Breadcrumbs items={breadcrumbs} />
            </div>
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
              <Icon name={icon} size={20} />
            </span>
            <SectionEyebrow className="mx-auto w-fit">{eyebrow}</SectionEyebrow>
            <SectionTitle as="h1" size="lg" id={id}>
              {title}
            </SectionTitle>
            <SectionDescription className="mx-auto mt-5 max-w-2xl">{intro}</SectionDescription>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={primary.href}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
              >
                {primary.label}
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

/** Light-surface section wrapper with label + H2, matching the AI page's section rhythm. */
export function ServicesSection({
  id,
  label,
  title,
  description,
  width = "max-w-6xl",
  first = false,
  children,
}: {
  id: string;
  label: string;
  title: string;
  description?: string;
  width?: string;
  /** The first section after the hero has no top border. */
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`${first ? "" : "border-t border-hairline-light "}bg-light-surface py-14 lg:py-20`}
      aria-labelledby={id}
    >
      <div className={`mx-auto ${width} px-6 lg:px-10`}>
        <Reveal>
          <SectionLabel>{label}</SectionLabel>
          <SectionTitle as="h2" id={id} className="max-w-xl">
            {title}
          </SectionTitle>
          {description && <SectionDescription className="mt-4 max-w-2xl">{description}</SectionDescription>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** Grid of service cards (icon, title, summary, link) — the AI page's "What's included" card. */
export function ServiceCardGrid({ services, columns = "sm:grid-cols-2 lg:grid-cols-3" }: { services: Service[]; columns?: string }) {
  return (
    <div className={`mt-10 grid gap-5 ${columns}`}>
      {services.map((svc, i) => (
        <Reveal key={svc.slug} delay={i * 70}>
          <Link
            href={servicePath(svc.slug)}
            className="group flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6 transition-colors duration-300 hover:border-aurora-violet/40"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors duration-300 group-hover:border-aurora-violet/50 group-hover:text-aurora-violet">
                <Icon name={svc.icon} size={17} />
              </span>
              <ArrowUpRight size={15} strokeWidth={1.75} className="text-ink-faint transition-colors group-hover:text-aurora-violet" />
            </div>
            <h3 className="mt-4 font-urbanist text-[15.5px] font-bold text-ink">{svc.title}</h3>
            <p className="mt-2 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{svc.summary}</p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

/** Closing "Book a Call" band — the AI page's final CTA card. */
export function BookCallCta({
  title,
  description,
  secondary = { label: "See all services", href: "/services" },
}: {
  title: string;
  description: string;
  secondary?: CtaLink;
}) {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] border border-hairline-light bg-canvas px-6 py-14 text-center sm:px-12 lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.16), transparent)" }}
          />
          <div className="relative">
            <SectionEyebrow className="mx-auto w-fit">Next step</SectionEyebrow>
            <SectionTitle size="lg" className="mx-auto max-w-2xl">
              {title}
            </SectionTitle>
            <SectionDescription className="mx-auto mt-4 max-w-xl">{description}</SectionDescription>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
              >
                Book a Call
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
              <Link
                href={secondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
              >
                {secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
