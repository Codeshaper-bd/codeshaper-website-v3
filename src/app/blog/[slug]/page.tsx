import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, RefreshCw, Clock } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PostCard from "@/components/blog/PostCard";
import BlogFinalCta from "@/components/blog/BlogFinalCta";
import AiSummary from "@/components/blog/AiSummary";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import ViewsReactions from "@/components/blog/ViewsReactions";
import BlogFaqAccordion from "@/components/blog/BlogFaqAccordion";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts, slugifyHeading } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", images: [post.image] },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const ARTICLE_CONTENT_ID = "article-content";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const headings = post.sections.map((s) => s.heading);

  const ARTICLE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.lastUpdated ?? post.date,
    author: { "@type": "Organization", name: post.author },
    mainEntityOfPage: postUrl,
  };

  const BREADCRUMB_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  const FAQ_JSON_LD =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <SiteShell>
      <div className="theme-light">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
        {FAQ_JSON_LD && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
        )}

        {/* Hero — same floating-card treatment as the blog index, centered to match */}
        <div className="bg-light-surface p-3 sm:p-4">
          <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <div className="flex justify-center">
                  <Breadcrumbs
                    items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
                  />
                </div>
                <SectionEyebrow className="mx-auto mt-5 w-fit">{post.topic}</SectionEyebrow>
                <SectionTitle as="h1" size="lg" className="mx-auto max-w-3xl">
                  {post.title}
                </SectionTitle>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3 font-urbanist text-[13.5px] leading-tight">
                  <Image src="/brand/favicon.png" alt="" width={30} height={30} className="h-[30px] w-[30px] shrink-0 rounded-full" />
                  <span className="font-semibold text-ink">{post.author}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-hairline-light" />
                  <span className="inline-flex items-center gap-1.5 text-ink-faint">
                    <Calendar size={13} strokeWidth={1.75} />
                    Published {formatDate(post.date)}
                  </span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-hairline-light" />
                  <span className="inline-flex items-center gap-1.5 text-ink-faint">
                    <RefreshCw size={13} strokeWidth={1.75} />
                    Updated {formatDate(post.lastUpdated)}
                  </span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-hairline-light" />
                  <span className="inline-flex items-center gap-1.5 text-ink-faint">
                    <Clock size={13} strokeWidth={1.75} />
                    {post.readingTime} min read
                  </span>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="bg-light-surface">
          <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
            <Reveal delay={80}>
              <div className="aspect-[21/9] overflow-hidden rounded-2xl bg-light-raised">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt="" className="h-full w-full object-cover" />
              </div>
            </Reveal>

            {/* Mobile only: TOC + AI Summary belong right after the image, not trailing the whole article — same order as the sidebar */}
            <div className="mt-8 space-y-5 lg:hidden">
              <TableOfContents headings={headings} />
              <AiSummary points={post.summaryPoints} />
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
              <div id={ARTICLE_CONTENT_ID} className="min-w-0">
                <div className="prose-article space-y-10 font-urbanist text-[16px] leading-relaxed text-ink-dim">
                  {post.sections.map((section) => (
                    <Reveal key={section.heading}>
                      <h2
                        id={slugifyHeading(section.heading)}
                        className="scroll-mt-28 font-urbanist text-xl font-bold tracking-tight text-ink sm:text-2xl"
                      >
                        {section.heading}
                      </h2>
                      <div className="mt-3 space-y-4">
                        {section.paragraphs.map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
                      </div>
                    </Reveal>
                  ))}
                </div>

                {post.techTags && post.techTags.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-2 border-t border-hairline-light pt-6">
                    {post.techTags.map((t) => (
                      <span key={t} className="rounded-full border border-hairline-light px-3 py-1 font-urbanist text-[12.5px] text-ink-faint">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {post.faqs.length > 0 && (
                  <div className="mt-14">
                    <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                      Frequently Asked Questions
                    </p>
                    <BlogFaqAccordion faqs={post.faqs} />
                  </div>
                )}

                <Link
                  href="/blog"
                  className="mt-12 inline-flex items-center gap-2 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:text-ink"
                >
                  <ArrowLeft size={15} strokeWidth={1.75} />
                  Back to Blog
                </Link>
              </div>

              <aside className="space-y-5 lg:sticky lg:top-32 lg:h-fit">
                <div className="hidden space-y-5 lg:block">
                  <TableOfContents headings={headings} />
                  <AiSummary points={post.summaryPoints} />
                </div>
                <div className="rounded-2xl border border-hairline-light bg-light-raised p-5">
                  <ShareButtons url={postUrl} title={post.title} />
                </div>
                <ViewsReactions slug={post.slug} />
                <div className="rounded-2xl border border-hairline-light bg-light-raised p-6">
                  <h3 className="font-urbanist text-[15px] font-bold text-ink">Need help shipping this?</h3>
                  <p className="mt-2 font-urbanist text-[13px] leading-relaxed text-ink-dim">
                    Talk it through with the team that wrote this.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-aurora-violet/70 px-5 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-colors hover:border-aurora-violet"
                  >
                    Book a Call
                    <ArrowRight size={13} strokeWidth={1.75} />
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="bg-light-surface p-3 sm:p-4">
            <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-16" aria-labelledby="similar-posts-heading">
              <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <SectionEyebrow>More Reading</SectionEyebrow>
                    <SectionTitle id="similar-posts-heading">Similar posts</SectionTitle>
                  </div>
                  <Link
                    href="/blog"
                    className="inline-flex w-fit items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-ink-dim transition-colors hover:text-aurora-violet"
                  >
                    See all articles
                    <ArrowRight size={14} strokeWidth={1.75} />
                  </Link>
                </div>
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p, i) => (
                    <Reveal key={p.slug} delay={i * 70}>
                      <PostCard post={p} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        <BlogFinalCta />
      </div>
    </SiteShell>
  );
}
