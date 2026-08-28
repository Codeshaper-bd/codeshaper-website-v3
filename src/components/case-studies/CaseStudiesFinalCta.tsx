import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/**
 * Round 2: the rounded "floating card" shell (`bg-light-surface` gutter
 * + `rounded-[32px] border`) is removed per direct request — this
 * section now spans full-bleed like the page's other flat sections
 * (CaseStudyBrowser) instead of matching the hero/FAQ/"How we work"
 * card family. To still read as a deliberate close rather than a bare
 * leftover, it keeps the hex-pattern texture + accent glow and gets a
 * clearer three-step "what happens next" strip instead of just two
 * bare buttons, so the redesigned section carries its own visual
 * weight without the card.
 */
const NEXT_STEPS = [
  "Tell us what you're building",
  "We recommend the right service + engagement model",
  "You get a clear plan and next steps",
];

export default function CaseStudiesFinalCta() {
  return (
    <section className="relative overflow-hidden bg-canvas px-6 py-16 sm:px-12 lg:px-16 lg:py-24" aria-labelledby="cs-cta-heading">
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
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">Next step</SectionEyebrow>
          <SectionTitle id="cs-cta-heading" size="lg" className="mx-auto max-w-2xl">
            Want similar results for your product?
          </SectionTitle>
          <SectionDescription className="mx-auto mt-4 max-w-xl">
            Tell us what you&apos;re building — we&apos;ll recommend the right service and engagement model.
          </SectionDescription>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
            >
              Book a Call
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
            >
              Start a Project
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <ol className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 text-left sm:flex-row sm:justify-center">
            {NEXT_STEPS.map((text, i) => (
              <li key={text} className="flex items-start gap-2.5 rounded-2xl border border-hairline-light bg-light-raised px-4 py-3 sm:flex-1">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-aurora-violet/50 font-urbanist text-[10px] font-semibold text-ink">
                  {i + 1}
                </span>
                <span className="font-urbanist text-[12.5px] leading-snug text-ink-dim">{text}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
