import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPage from "@/components/products/ProductPage";
import { PRODUCTS, getProduct } from "@/lib/products";
import { withSeo } from "@/lib/details";

export const generateStaticParams = () => PRODUCTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return withSeo({ title: p.title, description: p.summary, alternates: { canonical: `/products/${p.slug}` }, openGraph: { type: "website", images: [p.image] } }, p.seo);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  return <ProductPage product={p} />;
}
