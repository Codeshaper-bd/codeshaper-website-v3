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
 *
 * Round 2: moved into the page's floating-card family (same
 * `bg-light-surface` outer gutter + `rounded-[32px] bg-canvas` shell as
 * the hero and "How we work") with a hex-pattern texture and the
 * project's own accent color washed behind the quote card, instead of
 * a single flat bordered box on a plain section — matches the direct
 * request for a more modern design. The project's real cover image now
 * sits alongside the attribution as a small rounded thumbnail (not a
 * circle) so it reads as "which project this is from," not a fabricated
 * headshot of the named person.
 */
export default function FeaturedTestimonial() {
  const story = CASE_STUDIES.find((c) => c.testimonial);
  if (!story?.testimonial) return null;

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 py-14 lg:px-10 lg:py-20" aria-labelledby="testimonial-heading">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${story.accent}33, transparent)` }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <SectionEyebrow className="mx-auto w-fit">What clients say</SectionEyebrow>
            <SectionTitle id="testimonial-heading" className="mx-auto max-w-xl">
              What clients say after delivery
            </SectionTitle>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 rounded-[28px] border border-hairline-light bg-light-raised p-8 sm:p-12">
              <Quote size={32} strokeWidth={1.5} style={{ color: story.accent }} className="mx-auto" />
              <p className="mt-5 font-urbanist text-[19px] font-medium leading-relaxed text-ink sm:text-[22px]">
                &ldquo;{story.testimonial.quote}&rdquo;
              </p>

              <div className="mt-7 flex items-center justify-center gap-3 border-t border-hairline-light pt-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                <div className="text-left">
                  <p className="font-urbanist text-[14px] font-bold text-ink">{story.testimonial.name}</p>
                  <p className="font-urbanist text-[13px] text-ink-dim">{story.testimonial.role}</p>
                </div>
              </div>

              <Link
                href={`/case-studies/${story.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 font-urbanist text-[13px] font-semibold transition-[background-color,transform] duration-300 hover:scale-[1.02]"
                style={{ borderColor: `${story.accent}55`, color: story.accent, backgroundColor: `${story.accent}12` }}
              >
                Read the {story.project} case study
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
