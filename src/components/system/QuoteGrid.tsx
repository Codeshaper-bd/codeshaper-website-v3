import type { CSSProperties } from "react";
import { Quote as QuoteIcon } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import { textSafeAccent } from "@/lib/color";

export type Quote = { quote: string; name: string; role: string; accent: string };

/**
 * Static quote grid — deliberately simpler than the homepage's draggable
 * Testimonials carousel (that mechanism is homepage-specific); inner
 * pages stay editorial/restrained, matching case-studies' own calmer
 * treatment. Generalized (parameterized, decoupled from any content
 * file's types) for reuse across bespoke inner pages. Names/companies
 * are explicit placeholders unless the caller supplies real ones, same
 * convention as the homepage's Testimonials.tsx.
 *
 * Round 2: each card now gets the quoted person's own accent as a top
 * border + an initial "avatar" badge (not a fabricated photo) instead
 * of a plain bordered box — and an optional `card` prop switches the
 * whole section into the site's floating white-card treatment, since
 * both the Industries and SaaS pages asked for that background
 * specifically instead of a flat section.
 */
export default function QuoteGrid({
  id,
  title,
  items,
  columns = 3,
  card = false,
}: {
  id: string;
  title: string;
  items: Quote[];
  columns?: 2 | 3 | 4;
  card?: boolean;
}) {
  const colCls = columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  const body = (
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
            <article
              className="group flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_var(--q-glow)]"
              style={{ "--q-glow": `${t.accent}22`, borderTop: `3px solid ${t.accent}` } as CSSProperties}
            >
              <QuoteIcon size={22} strokeWidth={1.5} style={{ color: t.accent }} />
              <p className="mt-4 flex-1 font-urbanist text-[14.5px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 border-t border-hairline-light pt-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-urbanist text-[13px] font-bold"
                  style={{ backgroundColor: `${t.accent}14`, color: textSafeAccent(t.accent) }}
                  aria-hidden
                >
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="font-urbanist text-[13px] font-bold text-ink">{t.name}</p>
                  <p className="font-urbanist text-[12px] text-ink-dim">{t.role}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );

  if (card) {
    return (
      <div className="bg-light-surface p-3 sm:p-4">
        <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-20" aria-labelledby={id}>
          {body}
        </section>
      </div>
    );
  }

  return (
    <section className="bg-light-surface py-14 lg:py-20" aria-labelledby={id}>
      {body}
    </section>
  );
}
