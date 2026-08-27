import Link from "next/link";
import { Quote, ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { CASE_STUDIES } from "@/lib/caseStudies";

/**
 * A single real, attributed quote (Essentialist's Joan Roca) rather than a
 * row of testimonials — the sitewide Testimonials.tsx component is full of
 * explicit placeholder names/companies, which would directly contradict
 * this page's own "proof, not promises" premise if reused here.
 */
export default function FeaturedTestimonial() {
  const story = CASE_STUDIES.find((c) => c.testimonial);
  if (!story?.testimonial) return null;

  return (
    <section className="relative overflow-hidden bg-light-surface py-14 lg:py-20" aria-labelledby="testimonial-heading">
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">What clients say</SectionEyebrow>
          <SectionTitle id="testimonial-heading" className="mx-auto max-w-xl">
            What clients say after delivery
          </SectionTitle>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 rounded-[28px] border border-hairline-light bg-light-raised p-8 sm:p-12">
            <Quote size={32} strokeWidth={1.5} className="mx-auto text-aurora-violet" />
            <p className="mt-5 font-urbanist text-[19px] font-medium leading-relaxed text-ink sm:text-[22px]">
              &ldquo;{story.testimonial.quote}&rdquo;
            </p>
            <p className="mt-6 font-urbanist text-[14px] font-bold text-ink">{story.testimonial.name}</p>
            <p className="font-urbanist text-[13px] text-ink-dim">{story.testimonial.role}</p>
            <Link
              href={`/case-studies/${story.slug}`}
              className="mt-6 inline-flex items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-aurora-violet"
            >
              Read the {story.project} case study
              <ArrowRight size={14} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
