import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import { SectionEyebrow, SectionTitle } from "./SectionHeading";

/**
 * Shared prose shell for the two legal pages (Privacy, Terms). Both are
 * explicitly marked as drafts — see the banner below — since neither
 * has been reviewed by counsel or filled in with the real legal entity
 * name, governing-law jurisdiction, or effective date. Do not remove
 * the banner or the [TBD] placeholders without that review happening
 * first; this content exists to replace a broken stub link, not to
 * stand in as CodeShaper's actual policy.
 */
export default function LegalDoc({
  breadcrumbs,
  title,
  children,
}: {
  breadcrumbs: Crumb[];
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-canvas py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Breadcrumbs items={breadcrumbs} />
        <SectionEyebrow>Legal</SectionEyebrow>
        <SectionTitle as="h1" size="lg">
          {title}
        </SectionTitle>

        <div className="mt-8 rounded-xl border border-hairline bg-canvas-raised px-5 py-4 font-urbanist text-[13px] leading-relaxed text-ink-dim">
          <strong className="text-ink">Draft — not yet in effect.</strong> This is placeholder legal content
          covering the standard topics a policy like this needs, written to replace a broken link rather than
          to stand in as CodeShaper&apos;s reviewed, final policy. Anything marked <span className="text-ink">[TBD]</span> is
          specific to the company (legal entity name, governing-law jurisdiction, effective date, etc.) and
          needs to be filled in — ideally with counsel&apos;s review — before this page is treated as real.
        </div>

        <div className="prose-legal mt-10 space-y-8 font-urbanist text-[14.5px] leading-relaxed text-ink-dim [&_h2]:mb-2 [&_h2]:mt-0 [&_h2]:font-urbanist [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_p]:m-0 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </section>
  );
}
