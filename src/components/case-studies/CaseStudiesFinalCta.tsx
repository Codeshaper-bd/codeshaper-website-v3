import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

export default function CaseStudiesFinalCta() {
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
          </div>
        </div>
      </Reveal>
    </div>
  );
}
