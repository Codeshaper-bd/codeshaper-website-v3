import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/**
 * Same floating-card treatment as the homepage Hero (bg-light-surface
 * frame + rounded-[32px] canvas card) rather than a flat full-bleed
 * section — the fixed header floats on top of this card the same way
 * it floats on top of the homepage Hero, so the card's own top padding
 * (not the outer frame) is what clears it.
 */
export default function BlogHero() {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-28">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
          </div>
          <Reveal>
            <SectionEyebrow className="mx-auto w-fit">Blog</SectionEyebrow>
            <SectionTitle as="h1" size="lg" className="mx-auto max-w-3xl">
              Product, engineering, and AI insights for teams shipping real software
            </SectionTitle>
            <SectionDescription className="mx-auto mt-5 max-w-2xl">
              Practical articles on UX/UI, SaaS engineering, commerce, automation, and delivery — written from what
              we build every week.
            </SectionDescription>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="#browse"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-aurora-violet/70 px-6 py-3 font-urbanist text-sm font-semibold text-ink transition-colors hover:border-aurora-violet"
            >
              Browse Articles
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
