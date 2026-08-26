import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import BlogHero from "@/components/blog/BlogHero";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogBrowser from "@/components/blog/BlogBrowser";
import TopicCollections from "@/components/blog/TopicCollections";
import ReadingPaths from "@/components/blog/ReadingPaths";
import NewsletterForm from "@/components/blog/NewsletterForm";
import EditorsPicks from "@/components/blog/EditorsPicks";
import BlogFinalCta from "@/components/blog/BlogFinalCta";
import { BLOG_POSTS, getFeaturedPost } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Product, Engineering & AI Insights",
  description:
    "Practical articles on UX/UI, SaaS development, eCommerce, AI automation, DevOps, and delivery models — built from real projects at CodeShaper.",
  alternates: { canonical: "/blog" },
};

const BLOG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "CodeShaper Blog",
  url: `${SITE_URL}/blog`,
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
  ],
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const featured = getFeaturedPost();
  const rest = BLOG_POSTS.filter((p) => p.slug !== featured.slug);

  return (
    <SiteShell>
      <div className="theme-light">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />

        <BlogHero />
        <FeaturedPost post={featured} />
        <BlogBrowser posts={rest} initialTopic={topic} />
        <TopicCollections />
        <ReadingPaths />
        <NewsletterForm />
        <EditorsPicks />
        <BlogFinalCta />
      </div>
    </SiteShell>
  );
}
