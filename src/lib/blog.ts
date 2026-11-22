import posts from "@/content/posts.json";
import blog from "@/content/blog.json";

/**
 * Static blog content — the CMS/dynamic version referenced in the URL
 * strategy (/blog/{slug}) doesn't exist yet, so this is a typed array
 * standing in for it. Every post here is a genuine, complete article
 * (not filler), written from the same practices already described on
 * the Services/Engagement pages — not fabricated case studies, client
 * quotes, or invented statistics. Author is "The CodeShaper Team"
 * throughout rather than an invented named byline, since no real
 * individual authors are attached to this content yet.
 *
 * Cover images use the same seeded picsum.photos placeholder convention
 * already used for Testimonials/CaseStudiesExpand — clearly a stand-in,
 * not a real photo, until real cover art exists.
 *
 * `lastUpdated` is set equal to `date` on every post below — none of
 * them have actually been revised since publishing, so this is an
 * honest "last touched" date, not a fabricated freshness signal. When
 * a post genuinely gets revised later, update `lastUpdated` to the
 * real revision date and it'll read as a real update.
 */

export type PostFormat = string;
export type PostLevel = string;

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type Faq = { q: string; a: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** 2-4 bullet takeaways, shown in the "AI Summary" callout at the top of the article. */
  summaryPoints: string[];
  sections: ArticleSection[];
  faqs: Faq[];
  topic: string;
  format: PostFormat;
  level: PostLevel;
  industry?: string;
  techTags?: string[];
  author: string;
  date: string; // ISO
  lastUpdated: string; // ISO — equals `date` until a post is genuinely revised
  readingTime: number; // minutes
  image: string;
  imageAlt?: string;
  topicSlug?: string;
  tagSlugs?: string[];
  featured?: boolean;
  /** Headings of an article designed with blocks; its body is in content/details.json. */
  headings?: { id: string; text: string }[];
};

export const TOPICS: string[] = blog.categories.map((c) => c.title);

export const FORMATS: PostFormat[] = [...new Set(posts.map((p) => p.format))];
export const LEVELS: PostLevel[] = ["Beginner", "Intermediate", "Advanced"];

/** Same slugify used to build heading ids for the article body and the Table of Contents' jump links — one function so they can never drift out of sync. */
export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// written in the CMS (Blog)
export const BLOG_POSTS: BlogPost[] = posts;

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const sameTopic = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.topic === post.topic);
  const rest = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.topic !== post.topic);
  return [...sameTopic, ...rest].slice(0, count);
}
