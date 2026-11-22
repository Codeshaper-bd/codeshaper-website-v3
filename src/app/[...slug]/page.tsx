import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsPageView from "@/components/cms/CmsPageView";
import { PAGES, getPage } from "@/lib/pages";
import { withSeo } from "@/lib/details";

/** Pages made in the CMS. Any other address is not found. */
export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.path.slice(1).split("/") }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPage("/" + (await params).slug.join("/"));
  if (!p) return {};
  return withSeo({ title: p.title, description: p.intro, alternates: { canonical: p.path }, ...(p.image ? { openGraph: { type: "website" as const, images: [p.image] } } : {}) }, p.seo);
}

export default async function Page({ params }: Props) {
  const p = getPage("/" + (await params).slug.join("/"));
  if (!p) notFound();
  return <CmsPageView page={p} />;
}
