import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import HeroBackdrop from "@/components/system/HeroBackdrop";

export default function CaseStudyHero() {
  return (
    <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
      <section className="page-hero relative isolate overflow-hidden theme-light rounded-b-[28px] sm:rounded-b-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-36">
        <HeroBackdrop />
        <div className="relative mx-auto max-w-[1200px] [&>*]:max-w-3xl">
          <div className="flex">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Case Studies" }]} />
          </div>
          <Reveal>
            <SectionEyebrow className="w-fit">Case Studies</SectionEyebrow>
            <SectionTitle as="h1" size="lg" className="max-w-3xl">
              Success stories that prove delivery — not just promises
            </SectionTitle>
            <SectionDescription className="mt-5 max-w-2xl">
              Explore how we design, engineer, and automate digital products — with measurable outcomes, clean
              handover, and a predictable delivery cadence.
            </SectionDescription>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
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
        </div>
      </section>
    </div>
  );
}
