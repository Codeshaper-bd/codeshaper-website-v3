import "server-only";
import blog from "@/content/blog.json";
import { BLOG_POSTS, slugifyHeading, type BlogPost } from "./blog";
import { postDetail, type Seo } from "./details";

/**
 * Blog authors (CMS › Blog › Authors). Each author with a published post
 * has a page listing their articles: /blog/author/[slug].
 *
 * Content synced before 24 Nov 2026 has no author list or authorSlug yet:
 * then the author is worked out from the posts themselves (the name, and
 * the profile the article page already shows), so the pages work today and
 * switch to the CMS list on the next sync.
 */
export type Author = {
  slug: string;
  title: string;
  role?: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
  website?: string;
  seo?: Seo;
  count: number;
};

/** The company byline: an Organization in structured data, not a Person. */
export const TEAM_NAME = "The CodeShaper Team";

export const authorSlugOf = (p: BlogPost) => p.authorSlug ?? slugifyHeading(p.author);

function derive(): Author[] {
  const by = new Map<string, Author>();
  for (const p of BLOG_POSTS) {
    const slug = authorSlugOf(p);
    const a = by.get(slug) ?? { slug, title: p.author, count: 0 };
    const d = postDetail(p.slug).author;
    if (d) {
      a.role ??= d.role;
      a.bio ??= d.bio;
      a.photo ??= d.photo;
      a.linkedin ??= d.linkedin;
      a.website ??= d.website;
    }
    a.count += 1;
    by.set(slug, a);
  }
  return [...by.values()];
}

const fromCms = (blog as { authors?: Author[] }).authors;
export const AUTHORS: Author[] = fromCms?.length ? fromCms : derive();

export const getAuthor = (slug: string) => AUTHORS.find((a) => a.slug === slug);

export const postsBy = (slug: string) =>
  BLOG_POSTS.filter((p) => authorSlugOf(p) === slug).sort((a, b) => b.date.localeCompare(a.date));

export const authorHref = (p: BlogPost) => `/blog/author/${authorSlugOf(p)}`;
