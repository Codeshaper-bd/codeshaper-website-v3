import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Play } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import HeroBackdrop from "@/components/system/HeroBackdrop";
import { SectionDescription, SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { BookCallCta } from "@/components/services/ServicePageParts";
import { REAL_REVIEWS } from "@/data/reviews";
import { SITE } from "@/lib/siteSettings";
import { withShare } from "@/lib/share";

/**
 * All client reviews (owner, 25 Nov 2026: "a place to see every client review, linked from the footer").
 * Only reviews a client really gave (CMS › Work › Reviews, marked real), word for word, and the review
 * profiles on other sites (CMS › Settings › Footer › Reviews and partners). No placeholders, ever.
 */
export const metadata: Metadata = withShare({
  title: "Client Reviews",
  description: "What CodeShaper's clients say about working with us, in their own words, with links to our review profiles.",
  alternates: { canonical: "/reviews" },
});

const REVIEWS = REAL_REVIEWS.filter((r) => r.real);
const PROFILES = (SITE.footer.badges ?? []).filter((b) => /^https:\/\//.test(b.href));
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function ReviewsPage() {
  if (!REVIEWS.length && !PROFILES.length) notFound();
  return (
    <SiteShell>
      <div className="theme-light">
        <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
          <section className="page-hero relative isolate overflow-hidden rounded-b-[28px] bg-canvas px-6 pb-16 pt-32 sm:rounded-b-[32px] lg:px-10 lg:pb-20 lg:pt-36">
            <HeroBackdrop />
            {/* inside the page container, like every other page hero */}
            <div className="relative mx-auto max-w-[1200px]">
              <div className="flex"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} /></div>
              <SectionEyebrow className="mt-5 w-fit">Client reviews</SectionEyebrow>
              <SectionTitle as="h1" size="lg">In our clients&rsquo; own words.</SectionTitle>
              <SectionDescription className="mt-5 max-w-2xl">Every review here was written by a client, quoted word for word.</SectionDescription>
            </div>
          </section>
        </div>

        <div className="bg-light-surface">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
            {REVIEWS.length > 0 && (
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {REVIEWS.map((r, i) => (
                  <li key={`${r.name}-${i}`}>
                    <Reveal delay={(i % 3) * 70} className="h-full">
                      <figure className="flex h-full flex-col rounded-3xl border border-hairline-light bg-white p-7">
                        <blockquote className="flex-1 font-urbanist text-[17px] leading-relaxed text-ink">&ldquo;{r.quote}&rdquo;</blockquote>
                        {r.video && (
                          <a href={r.video.src} target="_blank" rel="noopener" className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#0b0f19] px-4 py-2 font-urbanist text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2433]">
                            <Play size={13} className="fill-current" aria-hidden />
                            Watch the video{r.video.duration ? ` (${r.video.duration})` : ""}
                          </a>
                        )}
                        <figcaption className="mt-7 flex items-center gap-3 border-t border-hairline-light pt-5">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-light-surface font-urbanist text-[13px] font-semibold text-ink">{initials(r.name)}</span>
                          <span className="min-w-0 flex-1 font-urbanist">
                            <span className="block text-[14.5px] font-semibold text-ink">{r.name}</span>
                            <span className="block text-[13px] text-ink-dim">{[r.role, r.company, r.market].filter(Boolean).join(", ")}</span>
                          </span>
                          {r.caseSlug && (
                            <Link href={`/case-studies/${r.caseSlug}`} aria-label={`Read the ${r.company} case study`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline-light text-ink transition-colors hover:bg-[#0b0f19] hover:text-white">
                              <ArrowUpRight size={15} aria-hidden />
                            </Link>
                          )}
                        </figcaption>
                      </figure>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}

            {PROFILES.length > 0 && (
              <section aria-labelledby="profiles-heading" className="mt-16">
                <h2 id="profiles-heading" className="font-urbanist text-[22px] font-bold tracking-[-0.02em] text-ink">More reviews on</h2>
                <ul className="mt-6 flex flex-wrap gap-3">
                  {PROFILES.map((b) => (
                    <li key={b.href}>
                      <a href={b.href} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 rounded-full border border-hairline-light bg-white px-5 py-3 font-urbanist text-[14px] font-semibold text-ink transition-colors hover:bg-[#f6f6f4]">
                        {b.title}
                        {b.subtitle && <span className="font-medium text-ink-dim">{b.subtitle}</span>}
                        <ArrowUpRight size={14} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
        <BookCallCta title="Want results like these?" description="Tell us what you are building and we will tell you honestly how we would approach it." secondary={{ label: "Case studies", href: "/case-studies" }} />
      </div>
    </SiteShell>
  );
}
