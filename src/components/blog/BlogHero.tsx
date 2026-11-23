import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import HeroBackdrop from "@/components/system/HeroBackdrop";

/**
 * Same floating-card treatment as the homepage Hero (bg-light-surface
 * frame + rounded-[32px] canvas card) rather than a flat full-bleed
 * section — the fixed header floats on top of this card the same way
 * it floats on top of the homepage Hero, so the card's own top padding
 * (not the outer frame) is what clears it.
 */
export default function BlogHero() {
  return (
    <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
      <section className="page-hero relative isolate overflow-hidden theme-light rounded-b-[28px] sm:rounded-b-[32px] bg-canvas px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-36">
        <HeroBackdrop />
        <div className="relative mx-auto max-w-[1200px] [&>*]:max-w-3xl">
          <div className="flex">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
          </div>
          <Reveal>
            <SectionEyebrow className="w-fit">Blog</SectionEyebrow>
            <SectionTitle as="h1" size="lg" className="max-w-3xl">
              Product, engineering, and AI insights for teams shipping real software
            </SectionTitle>
            <SectionDescription className="mt-5 max-w-2xl">
              Practical articles on UX/UI, SaaS engineering, commerce, automation, and delivery — written from what
              we build every week.
            </SectionDescription>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
              >
                Book a Call
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
              <Link
                href="#browse"
                className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
              >
                Browse Articles
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
