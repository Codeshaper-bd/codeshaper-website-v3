import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import BlogHero from "@/components/blog/BlogHero";
import BlogBrowser from "@/components/blog/BlogBrowser";
import BlogFinalCta from "@/components/blog/BlogFinalCta";
import { BLOG_POSTS } from "@/lib/blog";
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

  return (
    <SiteShell>
      <div className="theme-light">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />

        <BlogHero />
        <BlogBrowser posts={BLOG_POSTS} initialTopic={topic} />
        <BlogFinalCta />
      </div>
    </SiteShell>
  );
}
