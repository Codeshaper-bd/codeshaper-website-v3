import Link from "next/link";
import { Quote, ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { textSafeAccent } from "@/lib/color";

/**
 * A single real, attributed quote (Essentialist's Joan Roca) rather than a
 * row of testimonials — the sitewide Testimonials.tsx component is full of
 * explicit placeholder names/companies, which would directly contradict
 * this page's own "proof, not promises" premise if reused here.
 *
 * Round 3, direct feedback: no card at all — flat `bg-light-surface`
 * (#f5f4f2) section, same as e.g. Testimonials.tsx/EngagementModels.tsx
 * on the homepage. Replaced the boxed quote with an editorial split:
 * the project's real cover image (labeled with its industry/name, so
 * it reads as "the project," not a fabricated headshot) alongside a
 * large unboxed quote, tied together with the project's own accent
 * color instead of a border.
 */
export default function FeaturedTestimonial() {
  const story = CASE_STUDIES.find((c) => c.testimonial);
  if (!story?.testimonial) return null;

  return (
    <section className="relative overflow-hidden bg-light-surface py-16 lg:py-24" aria-labelledby="testimonial-heading">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">What clients say</SectionEyebrow>
          <SectionTitle id="testimonial-heading" className="mx-auto max-w-xl text-center">
            What clients say after delivery
          </SectionTitle>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={story.image} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-mid backdrop-blur-sm">
                {story.industry} · {story.project}
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Quote size={36} strokeWidth={1.5} style={{ color: story.accent }} />
            <p className="mt-5 font-urbanist text-[22px] font-medium leading-snug text-ink sm:text-[26px]">
              &ldquo;{story.testimonial.quote}&rdquo;
            </p>
            <div className="mt-7 flex items-center gap-3">
              <span aria-hidden className="h-px w-8" style={{ background: story.accent }} />
              <div>
                <p className="font-urbanist text-[14px] font-bold text-ink">{story.testimonial.name}</p>
                <p className="font-urbanist text-[13px] text-ink-dim">{story.testimonial.role}</p>
              </div>
            </div>
            <Link
              href={`/case-studies/${story.slug}`}
              className="mt-7 inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 font-urbanist text-[13px] font-semibold transition-[background-color,transform] duration-300 hover:scale-[1.02]"
              style={{ borderColor: `${story.accent}55`, color: textSafeAccent(story.accent), backgroundColor: `${story.accent}12` }}
            >
              Read the {story.project} case study
              <ArrowRight size={14} strokeWidth={1.75} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
