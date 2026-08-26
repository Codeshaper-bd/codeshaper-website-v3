import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "./SectionHeading";

export type GridCard = {
  icon: string;
  title: string;
  description: string;
  href: string;
  meta?: string;
};

/**
 * Shared template for index/landing pages (Services, Industries, Engagement
 * Models): breadcrumb, H1 + intro, then a grid of cards linking to each
 * detail page. Used by app/services, app/industries, app/engagement.
 */
export default function CardGridPage({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  items,
}: {
  breadcrumbs: Crumb[];
  eyebrow: string;
  title: string;
  intro: string;
  items: GridCard[];
}) {
  return (
    <section className="bg-canvas py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={breadcrumbs} />
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <SectionTitle as="h1" size="lg" className="max-w-2xl">
          {title}
        </SectionTitle>
        <SectionDescription className="mt-5 max-w-xl">{intro}</SectionDescription>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col rounded-2xl border border-hairline bg-canvas-raised p-6 transition-colors duration-300 hover:border-aurora-violet/50"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink-dim transition-colors duration-300 group-hover:border-aurora-violet/50 group-hover:text-ink">
                <Icon name={item.icon} size={18} />
              </span>
              <h2 className="mt-5 font-urbanist text-lg font-bold tracking-tight text-ink">{item.title}</h2>
              <p className="mt-2 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{item.description}</p>
              {item.meta && (
                <p className="mt-4 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
                  {item.meta}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-1.5 font-urbanist text-[13px] font-semibold text-ink-dim transition-colors duration-300 group-hover:text-ink">
                Explore
                <ArrowRight size={14} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
