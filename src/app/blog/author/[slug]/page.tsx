import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthorPage from "@/components/blog/AuthorPage";
import { AUTHORS, getAuthor, postsBy } from "@/lib/authors";
import { withSeo } from "@/lib/details";

export const dynamicParams = false;
export const generateStaticParams = () => AUTHORS.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getAuthor((await params).slug);
  if (!a) return {};
  return withSeo(
    {
      title: `${a.title}: articles`,
      description: a.bio?.slice(0, 160) ?? `Articles by ${a.title} on the CodeShaper blog: product, engineering and AI.`,
      alternates: { canonical: `/blog/author/${a.slug}` },
      openGraph: { type: "profile", images: a.photo ? [a.photo] : undefined },
    },
    a.seo,
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const author = getAuthor((await params).slug);
  if (!author) notFound();
  return <AuthorPage author={author} posts={postsBy(author.slug)} />;
}
