import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "./SectionHeading";

export type RelatedLink = { title: string; description: string; href: string; icon: string };

/**
 * Shared template for leaf detail pages (one service, one industry, one
 * engagement model): breadcrumb, icon + H1 + intro, an optional list of
 * supporting facts (e.g. industry "systems we build"), a CTA into /contact,
 * and a "related" grid back to sibling pages in the same category.
 */
export default function DetailPage({
  breadcrumbs,
  icon,
  eyebrow,
  title,
  intro,
  facts,
  ctaLabel = "Talk about this",
  related,
  relatedTitle = "Related",
}: {
  breadcrumbs: Crumb[];
  icon: string;
  eyebrow: string;
  title: string;
  intro: string;
  facts?: string[];
  ctaLabel?: string;
  related: RelatedLink[];
  relatedTitle?: string;
}) {
  return (
    <>
      <section className="bg-canvas py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Breadcrumbs items={breadcrumbs} />
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-hairline text-ink-dim">
            <Icon name={icon} size={20} />
          </span>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <SectionTitle as="h1" size="lg">
            {title}
          </SectionTitle>
          <SectionDescription className="mt-5">{intro}</SectionDescription>

          {facts && facts.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {facts.map((fact) => (
                <li
                  key={fact}
                  className="rounded-full border border-hairline bg-canvas-raised px-4 py-2 font-urbanist text-[13px] text-ink-dim"
                >
                  {fact}
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-aurora-violet/70 px-6 py-3 font-urbanist text-sm font-semibold text-ink transition-colors hover:border-aurora-violet"
          >
            {ctaLabel}
            <ArrowRight size={15} strokeWidth={1.75} />
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-hairline bg-canvas-raised py-14 lg:py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <p className="mb-6 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
              {relatedTitle}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex items-start gap-3 rounded-xl border border-hairline p-4 transition-colors duration-300 hover:border-aurora-violet/50"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-dim">
                    <Icon name={r.icon} size={15} />
                  </span>
                  <span>
                    <span className="block font-urbanist text-[14px] font-semibold text-ink">{r.title}</span>
                    <span className="mt-0.5 block font-urbanist text-[12.5px] leading-relaxed text-ink-dim">{r.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
