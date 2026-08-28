import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/**
 * Round 3, direct feedback: the 3-step "what happens next" strip added
 * in round 2 (to compensate for removing the rounded-card shell) made
 * the section feel busy rather than "better" — dropped entirely, and
 * vertical padding tightened, so this reads as a compact, confident
 * close instead of a second full section. Still full-bleed (no card),
 * still keeps the hex-pattern + accent-glow texture for visual weight.
 */
export default function CaseStudiesFinalCta() {
  return (
    <section className="relative overflow-hidden bg-canvas px-6 py-12 sm:px-12 lg:px-16 lg:py-16" aria-labelledby="cs-cta-heading">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[340px] w-[560px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.16), transparent)" }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">Next step</SectionEyebrow>
          <SectionTitle id="cs-cta-heading" size="lg" className="mx-auto max-w-xl">
            Want similar results for your product?
          </SectionTitle>
          <SectionDescription className="mx-auto mt-3 max-w-lg">
            Tell us what you&apos;re building — we&apos;ll recommend the right service and engagement model.
          </SectionDescription>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
      </div>
    </section>
  );
}
