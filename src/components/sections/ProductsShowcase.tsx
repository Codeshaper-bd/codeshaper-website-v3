import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import { PRODUCTS, PRODUCT_LINEUP, type Product } from "@/lib/products";
import ProductIndex, { type IndexItem } from "./ProductIndex";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import DotField from "@/components/sections/human-ai-flow/DotField";

/**
 * Homepage › our products, right after the case studies (owner, 25 Nov 2026: now an index in the
 * footer's order, see ProductIndex): once the visitor
 * has seen client work, "they build and run their own software too" lands as
 * proof of depth. A product catalogue, not another set of feature cards:
 * each card is the product's screen, its app icon and name, the one-line
 * promise and a short spec sheet (platforms, pricing, track record), the way
 * enterprise software vendors list their products. Deliberately unlike the
 * services cards above (no colour wash, no illustration): calm, factual,
 * comparable side by side. Products come from the CMS (Products); the words
 * above from Pages › Home. Hidden when there are no products.
 */

function price(p: Product): string | undefined {
  const mode = p.pricing?.mode ?? "demo";
  if (mode === "free") return "Free";
  if (mode === "from" && p.pricing?.from) return `From ${p.pricing.from}`;
  if (mode === "plans" && p.pricing?.plans?.length)
    return `From ${p.pricing.plans[0].price}${p.pricing.plans[0].period ? ` ${p.pricing.plans[0].period}` : ""}`;
  return p.stage === "soon" ? undefined : "On request";
}

/** Two headline facts per product: the price and the strongest proof. */
function facts(p: Product): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const proof = (p.stats ?? []).find((s) => /\d/.test(s.value));
  if (proof) out.push({ value: proof.value, label: proof.label.replace(/^Copies sold on /i, "Sold on ") });
  const pr = price(p);
  // only a real figure earns a spot ("On request" says nothing a buyer can compare)
  if (pr?.startsWith("From ")) out.push({ value: pr.slice(5), label: "Starting price" });
  else if (pr === "Free") out.push({ value: "Free", label: "Pricing" });
  if (!out.length && p.stage === "soon") out.push({ value: "Soon", label: "Launching" });
  return out.slice(0, 2);
}

export default function ProductsShowcase({ copy }: { copy?: CopyOf<"products"> }) {
  const c = homeCopy("products", copy);
  // the footer's line-up, in its order; a product with a page in the CMS brings its screen, line and facts
  const byName = new Map(PRODUCTS.filter((p) => p.stage !== "retired").map((p) => [p.title.toLowerCase(), p]));
  // the first five here (owner, 25 Nov 2026: "up to Dashcode"); every product is on /products
  const items: IndexItem[] = PRODUCT_LINEUP.slice(0, 5).map((l) => {
    const p = byName.get(l.label.toLowerCase());
    return { name: l.label, href: l.href, image: l.image, line: p?.tagline ?? l.note, ...(p ? { page: `/products/${p.slug}`, category: p.category, stage: p.stage, image: l.image ?? p.image, facts: facts(p) } : {}) };
  });
  if (!items.length) return null;

  return (
    <section aria-labelledby="products-heading" className="theme-light relative overflow-clip bg-light-surface py-16 lg:py-24">
      {/* the shared dotted background (as Human + AI), fading out at the top and bottom */}
      <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
              <SectionTitle id="products-heading" className="max-w-[16ch] text-balance">
                {c.title}
              </SectionTitle>
            </div>
            <Link
              href="/products"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#0b0f19]/10 bg-white px-4 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-colors hover:bg-[#f6f6f4]"
            >
              {c.button}
              <ArrowRight size={14} strokeWidth={1.9} aria-hidden />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-10 lg:mt-14">
          <ProductIndex items={items} />
        </Reveal>
      </div>
    </section>
  );
}
