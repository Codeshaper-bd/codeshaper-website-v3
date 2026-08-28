import { Quote as QuoteIcon } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";

export type Quote = { quote: string; name: string; role: string; accent: string };

/**
 * Static quote grid — deliberately simpler than the homepage's draggable
 * Testimonials carousel (that mechanism is homepage-specific); inner
 * pages stay editorial/restrained, matching case-studies' own calmer
 * treatment. Generalized (parameterized, decoupled from any content
 * file's types) for reuse across bespoke inner pages. Names/companies
 * are explicit placeholders unless the caller supplies real ones, same
 * convention as the homepage's Testimonials.tsx.
 */
export default function QuoteGrid({
  id,
  title,
  items,
  columns = 3,
}: {
  id: string;
  title: string;
  items: Quote[];
  columns?: 2 | 3 | 4;
}) {
  const colCls = columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <section className="bg-light-surface py-14 lg:py-20" aria-labelledby={id}>
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">Client Voices</SectionEyebrow>
          <SectionTitle id={id} className="mx-auto max-w-xl text-center">
            {title}
          </SectionTitle>
        </Reveal>

        <div className={`mt-10 grid gap-5 ${colCls}`}>
          {items.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <article className="flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6">
                <QuoteIcon size={22} strokeWidth={1.5} style={{ color: t.accent }} />
                <p className="mt-4 flex-1 font-urbanist text-[14.5px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 border-t border-hairline-light pt-4">
                  <p className="font-urbanist text-[13px] font-bold text-ink">{t.name}</p>
                  <p className="font-urbanist text-[12px] text-ink-dim">{t.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
