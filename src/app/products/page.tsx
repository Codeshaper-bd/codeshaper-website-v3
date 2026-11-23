import type { Metadata } from "next";
import { mainMeta } from "@/lib/mainPages";
import { notFound } from "next/navigation";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionDescription, SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { BookCallCta } from "@/components/services/ServicePageParts";
import ProductCard from "@/components/products/ProductCard";
import { PRODUCTS } from "@/lib/products";
import HeroBackdrop from "@/components/system/HeroBackdrop";

export const metadata: Metadata = mainMeta("products", { title: "Products", description: "Software products built and run by CodeShaper.", alternates: { canonical: "/products" } });

/** Appears once the first product is published in the CMS. */
export default function ProductsPage() {
  if (!PRODUCTS.length) notFound();
  return (
    <SiteShell>
      <div className="theme-light">
        <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
          <section className="page-hero relative isolate overflow-hidden theme-light rounded-b-[28px] sm:rounded-b-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-36">
            <HeroBackdrop />
            <div className="flex"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} /></div>
            <SectionEyebrow className="mt-5 w-fit">Products</SectionEyebrow>
            <SectionTitle as="h1" size="lg">Software we build and run ourselves.</SectionTitle>
            <SectionDescription className="mt-5 max-w-2xl">Ready to use, supported by the team that made it.</SectionDescription>
          </section>
        </div>
        <div className="bg-light-surface">
          <div className="mx-auto grid max-w-7xl gap-5 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-10 lg:py-16">{PRODUCTS.map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 70}><ProductCard product={p} /></Reveal>)}</div>
        </div>
        <BookCallCta title="Not sure which one fits?" description="Tell us how you work today and we will point you to the right one." secondary={{ label: "Our services", href: "/services" }} />
      </div>
    </SiteShell>
  );
}
