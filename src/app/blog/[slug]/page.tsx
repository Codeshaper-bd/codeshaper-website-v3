import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import PostCard from "@/components/blog/PostCard";
import BlogFinalCta from "@/components/blog/BlogFinalCta";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/blog";
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);

  const ARTICLE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  const BREADCRUMB_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <SiteShell>
      <div className="theme-light">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />

        <article className="bg-canvas pb-16 pt-32 lg:pb-20 lg:pt-40">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal>
              <Breadcrumbs
                items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
              />
              <p className="font-urbanist text-[12.5px] font-semibold uppercase tracking-[0.08em] text-aurora-violet">
                {post.topic} · {post.readingTime} min read
              </p>
              <h1 className="mt-3 font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                {post.title}
              </h1>
              <div className="mt-5 flex items-center gap-2 font-urbanist text-[13.5px] text-ink-faint">
                <span>{post.author}</span>
                <span aria-hidden>·</span>
                <span>{formatDate(post.date)}</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-light-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt="" className="h-full w-full object-cover" />
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="prose-article mt-10 space-y-5 font-urbanist text-[16px] leading-relaxed text-ink-dim">
                {post.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>

            {post.techTags && post.techTags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-hairline-light pt-6">
                {post.techTags.map((t) => (
                  <span key={t} className="rounded-full border border-hairline-light px-3 py-1 font-urbanist text-[12.5px] text-ink-faint">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <Link
              href="/blog"
              className="mt-10 inline-flex items-center gap-2 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:text-ink"
            >
              <ArrowLeft size={15} strokeWidth={1.75} />
              Back to Blog
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <p className="mb-6 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
                More from the blog
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        <BlogFinalCta />
      </div>
    </SiteShell>
  );
}
