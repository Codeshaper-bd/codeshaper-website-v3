import Link from "next/link";
import { ArrowRight, Gauge, Eye, FileCheck2 } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

const PROOF_POINTS = [
  { icon: Gauge, text: "Outcome-first delivery — speed, conversion, automation, reliability" },
  { icon: Eye, text: "Weekly demos and shared project visibility" },
  { icon: FileCheck2, text: "Clean handover — docs, source files, and ownership" },
];

export default function CaseStudyHero() {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32">
        <div aria-hidden className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }} />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Case Studies" }]} />
          </div>
          <Reveal>
            <SectionEyebrow className="mx-auto w-fit">Case Studies</SectionEyebrow>
            <SectionTitle as="h1" size="lg" className="mx-auto max-w-3xl">
              Success stories that prove delivery — not just promises
            </SectionTitle>
            <SectionDescription className="mx-auto mt-5 max-w-2xl">
              Explore how we design, engineer, and automate digital products — with measurable outcomes, clean
              handover, and a predictable delivery cadence.
            </SectionDescription>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#browse"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
              >
                View Case Studies
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-aurora-violet/70 px-7 py-3.5 font-urbanist text-sm font-semibold text-ink transition-colors hover:border-aurora-violet"
              >
                Book a Call
              </Link>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <ul className="mx-auto mt-10 flex max-w-3xl flex-col flex-wrap items-center justify-center gap-3 sm:flex-row sm:gap-6">
              {PROOF_POINTS.map((p) => (
                <li key={p.text} className="flex items-center gap-2 font-urbanist text-[13px] text-ink-dim">
                  <p.icon size={15} strokeWidth={1.75} className="shrink-0 text-aurora-violet" />
                  {p.text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
