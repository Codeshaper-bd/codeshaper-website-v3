import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

const PROOF_POINTS = [
  "Written from the same practices we use on real engagements",
  "Guides and checklists you can act on this week",
  "Clear, practical writing for busy product and engineering teams",
];

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-canvas pb-16 pt-32 lg:pb-20 lg:pt-40">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        <div className="text-center">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">Blog</SectionEyebrow>
          <SectionTitle as="h1" size="lg" className="mx-auto max-w-3xl">
            Product, engineering, and AI insights for teams shipping real software
          </SectionTitle>
          <SectionDescription className="mx-auto mt-5 max-w-2xl">
            Practical articles on UX/UI, SaaS engineering, commerce, automation, and delivery — written from what we
            build every week.
          </SectionDescription>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#topics"
              className="inline-flex items-center gap-2 rounded-full border border-aurora-violet/70 px-6 py-3 font-urbanist text-sm font-semibold text-ink transition-colors hover:border-aurora-violet"
            >
              Browse Topics
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
            <Link
              href="#newsletter"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:text-ink"
            >
              Subscribe to Updates
            </Link>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {PROOF_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 font-urbanist text-[13px] text-ink-faint">
                <span className="h-1 w-1 rounded-full bg-aurora-amber-dark" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
