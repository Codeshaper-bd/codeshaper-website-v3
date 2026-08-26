import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

export default function BlogFinalCta() {
  return (
    <section className="border-t border-hairline-light bg-canvas py-16 lg:py-20">
      <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">Next step</SectionEyebrow>
          <SectionTitle className="mx-auto">Have a project goal? We&apos;ll help you choose the best path.</SectionTitle>
          <SectionDescription className="mx-auto mt-3">
            Tell us your timeline and scope — we&apos;ll recommend the right starting model.
          </SectionDescription>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-aurora-violet/70 px-6 py-3 font-urbanist text-sm font-semibold text-ink transition-colors hover:border-aurora-violet"
            >
              Book a Call
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:text-ink"
            >
              Start a Project
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
