import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Target,
  Users,
  Wrench,
  Package,
  Workflow,
  Lightbulb,
  ClipboardCheck,
  MessageSquareQuote,
  Quote,
  Sparkles,
} from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import CaseStudiesFinalCta from "@/components/case-studies/CaseStudiesFinalCta";
import { CASE_STUDIES, getCaseStudyBySlug, getRelatedCaseStudies } from "@/lib/caseStudies";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getCaseStudyBySlug(slug);
  if (!story) return {};
  return {
    title: `${story.project} Case Study`,
    description: story.summary,
    alternates: { canonical: `/case-studies/${story.slug}` },
    openGraph: { type: "article", images: [story.image] },
  };
}

const SNAPSHOT_ICON: Record<string, typeof Target> = {
  Industry: Target,
  Services: Wrench,
  "Engagement model": Users,
  Timeline: ClipboardCheck,
  Team: Users,
  "Tech stack": Sparkles,
  Platforms: Package,
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{children}</p>
  );
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getCaseStudyBySlug(slug);
  if (!story) notFound();

  const related = getRelatedCaseStudies(story, 3);
  const storyUrl = `${SITE_URL}/case-studies/${story.slug}`;

  const snapshot: { label: string; value: string }[] = [
    { label: "Industry", value: story.industry },
    { label: "Services", value: story.services.join(", ") },
    ...(story.engagementModel ? [{ label: "Engagement model", value: story.engagementModel }] : []),
    ...(story.timeline ? [{ label: "Timeline", value: story.timeline }] : []),
    ...(story.team ? [{ label: "Team", value: story.team }] : []),
    { label: "Tech stack", value: story.tech.join(", ") },
    ...(story.platforms ? [{ label: "Platforms", value: story.platforms }] : []),
  ];

  const ARTICLE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: story.project,
    headline: story.headline,
    description: story.summary,
    image: story.image,
    about: story.industry,
  };

  const BREADCRUMB_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: `${SITE_URL}/case-studies` },
      { "@type": "ListItem", position: 3, name: story.project, item: storyUrl },
    ],
  };

  return (
    <SiteShell>
      <div className="theme-light">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />

        {/* Impact hero */}
        <div className="bg-light-surface p-3 sm:p-4">
          <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32">
            <div aria-hidden className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }} />
            <div className="relative mx-auto max-w-3xl text-center">
              <Reveal>
                <div className="flex justify-center">
                  <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Case Studies", href: "/case-studies" }, { label: story.project }]} />
                </div>
                <p className="mt-5 font-urbanist text-[12.5px] font-semibold uppercase tracking-[0.08em] text-aurora-violet">
                  {story.industry} · {story.project}
                </p>
                <h1 className="mt-3 font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                  {story.headline}
                </h1>
                <p className="mx-auto mt-5 max-w-2xl font-urbanist text-[15.5px] leading-relaxed text-ink-dim">
                  {story.summary}
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Book a Call
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </Link>
                  <Link
                    href="/case-studies"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    View Similar Stories
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                  {story.stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-hairline-light bg-light-raised px-4 py-4">
                      <p className="font-urbanist text-[15px] font-bold leading-tight text-ink">{s.value}</p>
                      <p className="mt-1 font-urbanist text-[11.5px] leading-snug text-ink-dim">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="bg-light-surface">
          {/* Cover image */}
          <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
            <Reveal delay={80}>
              <div className="aspect-[21/9] overflow-hidden rounded-2xl bg-light-raised">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.image} alt="" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          </div>

          <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">
            {/* Project snapshot */}
            <Reveal>
              <SectionLabel>Project snapshot</SectionLabel>
              <div className="grid gap-4 rounded-2xl border border-hairline-light bg-light-raised p-6 sm:grid-cols-2">
                {snapshot.map((f) => {
                  const Icon = SNAPSHOT_ICON[f.label] ?? Target;
                  return (
                    <div key={f.label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline-light text-aurora-violet">
                        <Icon size={14} strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="font-urbanist text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint">{f.label}</p>
                        <p className="mt-0.5 font-urbanist text-[14px] leading-snug text-ink">{f.value}</p>
                      </div>
                    </div>
                  );
                })}
                {story.liveUrl && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline-light text-aurora-violet">
                      <ExternalLink size={14} strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-urbanist text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint">Live site</p>
                      <a href={story.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-block font-urbanist text-[14px] font-semibold text-aurora-violet hover:underline">
                        {story.liveUrl.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Challenge */}
            {story.challenge && story.challenge.length > 0 && (
              <Reveal>
                <div className="mt-14">
                  <SectionLabel>The challenge</SectionLabel>
                  <ul className="space-y-3">
                    {story.challenge.map((c) => (
                      <li key={c} className="flex items-start gap-3">
                        <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-aurora-violet" />
                        <span className="font-urbanist text-[15px] leading-relaxed text-ink-dim">{c}</span>
                      </li>
                    ))}
                  </ul>
                  {story.risk && (
                    <p className="mt-5 rounded-xl border border-hairline-light bg-light-raised px-5 py-4 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">
                      <span className="font-semibold text-ink">What was at risk: </span>
                      {story.risk}
                    </p>
                  )}
                </div>
              </Reveal>
            )}

            {/* Goals */}
            {story.goals && (
              <Reveal>
                <div className="mt-14">
                  <SectionLabel>What success looked like</SectionLabel>
                  <div className="grid gap-5 sm:grid-cols-3">
                    {([
                      ["Business goals", story.goals.business],
                      ["User goals", story.goals.user],
                      ["Engineering goals", story.goals.engineering],
                    ] as const).map(([title, items]) => (
                      <div key={title} className="rounded-2xl border border-hairline-light bg-light-raised p-5">
                        <h3 className="font-urbanist text-[14px] font-bold text-ink">{title}</h3>
                        <ul className="mt-3 space-y-2">
                          {items.map((it) => (
                            <li key={it} className="font-urbanist text-[13px] leading-relaxed text-ink-dim">
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Deliverables */}
            {story.deliverables && story.deliverables.length > 0 && (
              <Reveal>
                <div className="mt-14">
                  <SectionLabel>What we delivered</SectionLabel>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {story.deliverables.map((d) => (
                      <div key={d} className="flex items-start gap-3 rounded-xl border border-hairline-light bg-light-raised px-4 py-3.5">
                        <Package size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-aurora-violet" />
                        <span className="font-urbanist text-[13.5px] leading-relaxed text-ink">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Approach */}
            {story.approach && story.approach.length > 0 && (
              <Reveal>
                <div className="mt-14">
                  <SectionLabel>How we approached it</SectionLabel>
                  <ol className="space-y-3">
                    {story.approach.map((step, i) => (
                      <li key={step} className="flex items-start gap-4 rounded-xl border border-hairline-light bg-light-raised px-5 py-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-urbanist text-[12px] font-bold text-canvas">
                          {i + 1}
                        </span>
                        <span className="mt-0.5 font-urbanist text-[14px] leading-relaxed text-ink-dim">{step}</span>
                      </li>
                    ))}
                  </ol>
                  {story.cadence && (
                    <p className="mt-5 flex items-center gap-2.5 font-urbanist text-[13px] text-ink-faint">
                      <Workflow size={15} strokeWidth={1.75} className="shrink-0 text-aurora-violet" />
                      {story.cadence}
                    </p>
                  )}
                </div>
              </Reveal>
            )}

            {/* Key solutions */}
            {story.solutions && story.solutions.length > 0 && (
              <Reveal>
                <div className="mt-14">
                  <SectionLabel>Key decisions we made</SectionLabel>
                  <div className="space-y-4">
                    {story.solutions.map((s) => (
                      <div key={s.problem} className="rounded-2xl border border-hairline-light bg-light-raised p-6">
                        <div className="flex items-start gap-3">
                          <Lightbulb size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-aurora-violet" />
                          <p className="font-urbanist text-[14px] font-semibold text-ink">{s.problem}</p>
                        </div>
                        <p className="mt-3 font-urbanist text-[14px] leading-relaxed text-ink-dim">{s.decision}</p>
                        <p className="mt-3 border-t border-hairline-light pt-3 font-urbanist text-[13px] leading-relaxed text-ink-faint">
                          <span className="font-semibold text-ink-dim">Why it worked: </span>
                          {s.whyItWorked}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Results */}
            {story.results && (story.results.operational?.length || story.results.qualitative?.length) && (
              <Reveal>
                <div className="mt-14">
                  <SectionLabel>Results & impact</SectionLabel>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {story.results.operational && story.results.operational.length > 0 && (
                      <div className="rounded-2xl border border-hairline-light bg-light-raised p-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline-light text-aurora-violet">
                          <ClipboardCheck size={17} strokeWidth={1.75} />
                        </span>
                        <h3 className="mt-4 font-urbanist text-[14px] font-bold text-ink">Operational proof</h3>
                        <ul className="mt-3 space-y-2">
                          {story.results.operational.map((r) => (
                            <li key={r} className="font-urbanist text-[13.5px] leading-relaxed text-ink-dim">
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {story.results.qualitative && story.results.qualitative.length > 0 && (
                      <div className="rounded-2xl border border-hairline-light bg-light-raised p-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline-light text-aurora-violet">
                          <MessageSquareQuote size={17} strokeWidth={1.75} />
                        </span>
                        <h3 className="mt-4 font-urbanist text-[14px] font-bold text-ink">Qualitative outcomes</h3>
                        <ul className="mt-3 space-y-2">
                          {story.results.qualitative.map((r) => (
                            <li key={r} className="font-urbanist text-[13.5px] leading-relaxed text-ink-dim">
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Screens gallery */}
            {story.gallery && story.gallery.length > 0 && (
              <Reveal>
                <div className="mt-14">
                  <SectionLabel>Product walkthrough</SectionLabel>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {story.gallery.map((g) => (
                      <figure key={g.src} className="overflow-hidden rounded-2xl border border-hairline-light bg-light-raised">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                        <figcaption className="px-4 py-3 font-urbanist text-[12.5px] leading-snug text-ink-dim">{g.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Testimonial */}
            {story.testimonial && (
              <Reveal>
                <div className="mt-14 rounded-[24px] border border-hairline-light bg-light-raised p-8 text-center sm:p-10">
                  <Quote size={28} strokeWidth={1.5} className="mx-auto text-aurora-violet" />
                  <p className="mx-auto mt-5 max-w-2xl font-urbanist text-[17px] font-medium leading-relaxed text-ink">
                    &ldquo;{story.testimonial.quote}&rdquo;
                  </p>
                  <p className="mt-5 font-urbanist text-[13.5px] font-bold text-ink">{story.testimonial.name}</p>
                  <p className="font-urbanist text-[12.5px] text-ink-dim">{story.testimonial.role}</p>
                </div>
              </Reveal>
            )}

            {/* What's next */}
            {story.whatsNext && story.whatsNext.length > 0 && (
              <Reveal>
                <div className="mt-14">
                  <SectionLabel>What&apos;s next</SectionLabel>
                  <ul className="space-y-3">
                    {story.whatsNext.map((n) => (
                      <li key={n} className="flex items-start gap-3">
                        <ArrowRight size={15} strokeWidth={1.75} className="mt-1 shrink-0 text-aurora-violet" />
                        <span className="font-urbanist text-[14.5px] leading-relaxed text-ink-dim">{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Link
              href="/case-studies"
              className="mt-14 inline-flex items-center gap-2 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:text-ink"
            >
              <ArrowLeft size={15} strokeWidth={1.75} />
              Back to Case Studies
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <p className="mb-6 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
                More stories like this
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((s) => (
                  <CaseStudyCard key={s.slug} story={s} />
                ))}
              </div>
            </div>
          </section>
        )}

        <CaseStudiesFinalCta />
      </div>
    </SiteShell>
  );
}
