import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PostCard, { fmtDate } from "@/components/blog/PostCard";
import BlogFinalCta from "@/components/blog/BlogFinalCta";
import AiSummary from "@/components/blog/AiSummary";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import ViewsReactions from "@/components/blog/ViewsReactions";
import BlogFaqAccordion from "@/components/blog/BlogFaqAccordion";
import RichContent from "@/components/cms/RichContent";
import HeroBackdrop from "@/components/system/HeroBackdrop";
import ArticleTracker from "@/components/blog/ArticleTracker";
import SelectionShare from "@/components/blog/SelectionShare";
import HeadingLink from "@/components/blog/HeadingLink";
import ArticleAskAI from "@/components/blog/ArticleAskAI";
import ReadCount from "@/components/blog/ReadCount";
import HelpCard from "@/components/blog/HelpCard";
import FounderNote from "@/components/blog/FounderNote";
import { authorHref } from "@/lib/authors";
import DotField from "@/components/sections/human-ai-flow/DotField";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts, slugifyHeading, type BlogPost } from "@/lib/blog";
import { postDetail, type PostDetail } from "@/lib/details";
import { SITE_URL } from "@/lib/site";
import blog from "@/content/blog.json";

/**
 * Blog article (owner, 24 Nov 2026: more organized, easier to read).
 *  · Hero: Home › Blog › Topic, title, the excerpt as a standfirst, one meta
 *    line (author · date · read time; "Updated" only when it really was).
 *  · Cover in a white frame, then two columns: the article in a reading
 *    measure (~70 characters a line, darker body text) and a short sticky
 *    rail (on this page + reading progress, share, one call to action)
 *    that always fits the screen.
 *  · The article opens with Key takeaways and ends with what a reader does
 *    next: tags, "was this helpful?", FAQ, previous/next article.
 *  · Interactive (24 Nov 2026): real read counts (CMS), time left, select a
 *    sentence to share it, copy a link to any heading, ask an AI about the
 *    article, reactions. ArticleTracker sends views/reads/time to the CMS.
 */
const ARTICLE_ID = "article-content";
const CATEGORY_SLUG = new Map(blog.categories.map((c) => [c.title, c.slug]));
const TAG_TITLE = new Map((blog.tags as { slug: string; title: string }[]).map((t) => [t.slug, t.title]));

const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function Neighbour({ post, dir }: { post: BlogPost; dir: "prev" | "next" }) {
  const next = dir === "next";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col gap-2 rounded-[20px] border border-hairline-light bg-white p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#0b0f19]/[0.12] hover:shadow-[0_18px_40px_-28px_rgba(11,15,25,0.35)] ${next ? "sm:items-end sm:text-right" : ""}`}
    >
      <span className="inline-flex items-center gap-1.5 font-urbanist text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
        {!next && <ArrowLeft size={13} strokeWidth={2} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-0.5" />}
        {next ? "Next article" : "Previous article"}
        {next && <ArrowRight size={13} strokeWidth={2} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5" />}
      </span>
      <span className="line-clamp-2 font-urbanist text-[15.5px] font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-aurora-violet">
        {post.title}
      </span>
    </Link>
  );
}

/**
 * "Best / top N" articles (owner, 24 Nov 2026): the numbered entries ("1. Boldway by Flowzai: …")
 * as an ItemList, so search engines read the page as a ranked list. Needs at least 3 headings
 * numbered 1, 2, 3… in order; each item points at its heading on this page.
 */
function itemListOf(post: BlogPost, html: string | undefined, postUrl: string) {
  if (!html || !/\b(best|top)\b/i.test(post.title)) return null;
  const decode = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#0?39;/g, "'").replace(/&quot;/g, '"').trim();
  const items: { position: number; name: string; url: string }[] = [];
  for (const m of html.matchAll(/<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)) {
    const text = decode(m[3].replace(/<mark[\s\S]*?<\/mark>/g, ""));
    const n = text.match(/^(\d+)\.\s*(.+)$/);
    if (!n || Number(n[1]) !== items.length + 1) continue;
    items.push({ position: items.length + 1, name: n[2].split(":")[0].trim(), url: `${postUrl}#${m[2]}` });
  }
  if (items.length < 3) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: post.title,
    numberOfItems: items.length,
    itemListElement: items.map((i) => ({ "@type": "ListItem", ...i })),
  };
}

export default function BlogArticle({ post, detail = postDetail(post.slug) }: { post: BlogPost; detail?: PostDetail }) {
  const chosen = (detail.related ?? []).flatMap((s) => getPostBySlug(s) ?? []).slice(0, 3);
  const related = chosen.length ? chosen : getRelatedPosts(post, 3);
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const headings = detail.hideToc ? [] : post.headings ?? post.sections.map((s) => s.heading);
  const categorySlug = CATEGORY_SLUG.get(post.topic);
  const updated = post.lastUpdated && post.lastUpdated !== post.date ? post.lastUpdated : null;

  // previous = older, next = newer (by date)
  const byDate = [...BLOG_POSTS].sort((a, b) => a.date.localeCompare(b.date));
  const at = byDate.findIndex((p) => p.slug === post.slug);
  const prev = at > 0 ? byDate[at - 1] : undefined;
  const next = at >= 0 && at < byDate.length - 1 ? byDate[at + 1] : undefined;

  const tags = (post.tagSlugs ?? []).filter((s) => TAG_TITLE.has(s));

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

  const ITEM_LIST_JSON_LD = itemListOf(post, detail.html, postUrl);

  return (
    <SiteShell>
      <div className="theme-light">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
        {FAQ_JSON_LD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />}
        {ITEM_LIST_JSON_LD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_JSON_LD) }} />}

        {/* hero: the shared page hero */}
        <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
          <section className="page-hero theme-light relative isolate overflow-hidden rounded-b-[28px] bg-canvas px-6 pb-14 pt-32 sm:rounded-b-[32px] lg:px-10 lg:pb-16 lg:pt-36">
            <HeroBackdrop />
            <div className="relative mx-auto max-w-[1200px] [&>*]:max-w-4xl">
              <div className="flex">
                <Breadcrumbs
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Blog", href: "/blog" },
                    categorySlug ? { label: post.topic, href: `/blog/category/${categorySlug}` } : { label: post.topic },
                  ]}
                />
              </div>
              <Reveal>
                <SectionEyebrow className="w-fit">{post.topic}</SectionEyebrow>
                <SectionTitle as="h1" size="lg" className="text-balance sm:text-[52px] sm:leading-[1.08]">
                  {post.title}
                </SectionTitle>
                <p className="mt-5 max-w-2xl font-urbanist text-[17px] leading-relaxed text-ink-dim sm:text-[18px]">{post.excerpt}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-urbanist text-[13.5px] text-ink-dim">
                  {/* the author: opens their page with all their articles */}
                  <Link href={authorHref(post)} rel="author" className="group/author flex items-center gap-2.5">
                    <Image src={detail.author?.photo || "/brand/favicon.png"} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full bg-white object-cover ring-2 ring-white transition-transform duration-300 group-hover/author:scale-105" />
                    <span className="font-semibold text-ink underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover/author:decoration-[#0b0f19]/40">
                      {detail.author?.name ?? post.author}
                    </span>
                  </Link>
                  <span aria-hidden className="text-ink-faint max-sm:hidden">·</span>
                  {/* date and reading time stay together (on phones: their own line) */}
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 max-sm:w-full">
                    <time dateTime={post.date} className="whitespace-nowrap">{longDate(post.date)}</time>
                    <span aria-hidden className="text-ink-faint">·</span>
                    <span className="whitespace-nowrap">{post.readingTime} min read</span>
                    <ReadCount slug={post.slug} min={1} dotClassName="mr-3 text-ink-faint" />
                    {updated && (
                      <>
                        <span aria-hidden className="text-ink-faint">·</span>
                        <span className="whitespace-nowrap">
                          Updated <time dateTime={updated}>{fmtDate(updated)}</time>
                        </span>
                      </>
                    )}
                  </span>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="relative overflow-clip bg-light-surface">
          {/* rail on the left (sticky), the cover + article on the right (owner, 24 Nov 2026) */}
          <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-8 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-14 lg:px-10 lg:pb-16 lg:pt-10 xl:gap-20">
            <div className="min-w-0 lg:col-start-2 lg:row-start-1">
            {/* cover, in a white frame */}
            <div className="rounded-[28px] border border-hairline-light bg-white p-2">
              <div className="aspect-[16/9] overflow-hidden rounded-[22px] bg-light-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.imageAlt ?? ""} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
              </div>
            </div>

            {/* the article */}
            <article id={ARTICLE_ID} className="mt-10 min-w-0 lg:mt-12">
              <AiSummary points={post.summaryPoints} />

              <div className="mt-6 lg:hidden">
                <TableOfContents headings={headings} articleId={ARTICLE_ID} readingMinutes={post.readingTime} variant="mobile" />
              </div>

              {detail.html && (
                <div className="mt-12">
                  <RichContent html={detail.html} narrow className="pb-article" />
                </div>
              )}

              {post.sections.length > 0 && (
                <div className="mt-12 font-urbanist">
                  {post.sections.map((section, i) => (
                    <section key={section.heading} className={i > 0 ? "mt-12" : ""}>
                      <h2
                        id={slugifyHeading(section.heading)}
                        className="group/h scroll-mt-28 text-balance text-[24px] font-bold leading-[1.25] tracking-[-0.015em] text-ink sm:text-[28px]"
                      >
                        {section.heading}
                        <HeadingLink id={slugifyHeading(section.heading)} label={section.heading} />
                      </h2>
                      <div className="mt-4 space-y-5 text-[17px] leading-[1.8] text-ink-mid">
                        {section.paragraphs.map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {tags.length > 0 && (
                <div className="mt-12 flex flex-wrap items-center gap-2">
                  <span className="mr-1 font-urbanist text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Tagged</span>
                  {tags.map((s) => (
                    <Link
                      key={s}
                      href={`/blog/tag/${s}`}
                      className="rounded-full border border-hairline-light bg-white px-3.5 py-1.5 font-urbanist text-[13px] font-medium text-ink-dim transition-colors hover:border-[#0b0f19]/[0.2] hover:text-ink"
                    >
                      {TAG_TITLE.get(s)}
                    </Link>
                  ))}
                </div>
              )}

              {/* what the reader does at the end: react, share */}
              <div className="mt-10 flex flex-col gap-6 rounded-[24px] border border-hairline-light bg-white p-6 sm:flex-row sm:items-end sm:justify-between sm:p-7">
                <ViewsReactions slug={post.slug} />
                <ShareButtons url={postUrl} title={post.title} />
              </div>
              <div className="mt-4 rounded-[24px] border border-hairline-light bg-white p-6 lg:hidden">
                <ArticleAskAI url={postUrl} title={post.title} />
              </div>

              {/* a founder's own words about this article (CMS › Post › Key points › Founder's note) */}
              {detail.founderNote && <FounderNote by={detail.founderNote.by} quote={detail.founderNote.quote} />}

              {post.faqs.length > 0 && (
                <section aria-labelledby="article-faq" className="mt-16">
                  <h2 id="article-faq" className="font-urbanist text-[24px] font-bold tracking-[-0.015em] text-ink sm:text-[28px]">
                    Frequently asked questions
                  </h2>
                  <div className="mt-6">
                    <BlogFaqAccordion faqs={post.faqs} />
                  </div>
                </section>
              )}

              {detail.sources && detail.sources.length > 0 && (
                <div className="mt-12 border-t border-[#0b0f19]/[0.08] pt-6">
                  <p className="mb-3 font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Sources</p>
                  <ul className="space-y-2 font-urbanist text-[14px]">
                    {detail.sources.map((x) => (
                      <li key={x.url}>
                        <a href={x.url} rel="noopener" className="text-[#4f46e5] hover:underline">
                          {x.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {detail.author?.bio && (
                <div className="mt-12 flex gap-5 rounded-[24px] border border-hairline-light bg-white p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {detail.author.photo && <img src={detail.author.photo} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />}
                  <div>
                    <p className="font-urbanist text-[15px] font-bold text-ink">
                      {detail.author.name}
                      {detail.author.role && <span className="font-normal text-ink-faint">, {detail.author.role}</span>}
                    </p>
                    <p className="mt-1.5 font-urbanist text-[14px] leading-relaxed text-ink-dim">{detail.author.bio}</p>
                    <Link href={authorHref(post)} className="mt-2 mr-4 inline-block font-urbanist text-[13.5px] font-semibold text-ink hover:underline">
                      All articles by {detail.author.name.split(" ")[0]} →
                    </Link>
                    {detail.author.linkedin && (
                      <a href={detail.author.linkedin} rel="noopener" className="mt-2 inline-block font-urbanist text-[13.5px] font-semibold text-[#4f46e5] hover:underline">
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}

              {(prev || next) && (
                <nav aria-label="More articles" className="mt-16 grid gap-4 sm:grid-cols-2">
                  <div>{prev && <Neighbour post={prev} dir="prev" />}</div>
                  <div>{next && <Neighbour post={next} dir="next" />}</div>
                </nav>
              )}
            </article>
            </div>

            {/* the rail (left): short enough to always fit the screen */}
            <aside className="hidden lg:col-start-1 lg:row-start-1 lg:block">
              {/* always fits the screen (owner, 24 Nov 2026: it looked cut off): the contents list takes
                  the room left and scrolls on its own; share and Ask AI always show; the help card
                  steps aside on short screens */}
              <div className="sticky top-24 -mx-12 flex max-h-[calc(100svh-7rem)] flex-col gap-6 px-12 pb-6">
                <ReadCount slug={post.slug} min={1} withDot={false} className="block shrink-0 font-urbanist text-[13px] font-medium text-ink-dim" />
                <TableOfContents headings={headings} articleId={ARTICLE_ID} readingMinutes={post.readingTime} />
                <div className="shrink-0 space-y-5 border-t border-[#0b0f19]/[0.08] pt-6">
                  <ShareButtons url={postUrl} title={post.title} />
                  <ArticleAskAI url={postUrl} title={post.title} />
                </div>
                <div className="shrink-0 [@media(max-height:860px)]:hidden">
                  <HelpCard title={detail.cta?.title ?? "Need help shipping this?"} label={detail.cta?.label ?? "Book a Call"} href={detail.cta?.href ?? "/contact"} />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="similar-posts-heading" className="theme-light relative overflow-clip bg-light-surface pb-16 pt-4 lg:pb-24">
            <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
            <div className="relative mx-auto max-w-7xl border-t border-[#0b0f19]/[0.08] px-6 pt-14 lg:px-10 lg:pt-20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionEyebrow>Keep reading</SectionEyebrow>
                  <SectionTitle id="similar-posts-heading">Related articles</SectionTitle>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-hairline-light bg-white px-5 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-[border-color,box-shadow] duration-300 hover:border-[#0b0f19]/[0.2]"
                >
                  All articles
                  <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden />
                </Link>
              </div>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p, i) => (
                  <li key={p.slug}>
                    <Reveal delay={i * 70} className="h-full">
                      <PostCard post={p} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <BlogFinalCta />
        <ArticleTracker slug={post.slug} articleId={ARTICLE_ID} readingMinutes={post.readingTime} />
        <SelectionShare articleId={ARTICLE_ID} url={postUrl} title={post.title} />
      </div>
    </SiteShell>
  );
}
