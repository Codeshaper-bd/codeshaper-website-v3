import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, LayoutDashboard, Package, ReceiptText, ShoppingBag, type LucideIcon } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import { PRODUCTS, STAGE, type Product } from "@/lib/products";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import DotField from "@/components/sections/human-ai-flow/DotField";

/**
 * Homepage › our products, right after the case studies: once the visitor
 * has seen client work, "they build and run their own software too" lands as
 * proof of depth. A product catalogue, not another set of feature cards:
 * each card is the product's screen, its app icon and name, the one-line
 * promise and a short spec sheet (platforms, pricing, track record), the way
 * enterprise software vendors list their products. Deliberately unlike the
 * services cards above (no colour wash, no illustration): calm, factual,
 * comparable side by side. Products come from the CMS (Products); the words
 * above from Pages › Home. Hidden when there are no products.
 */
const DOT: Record<string, string> = { live: "#16a34a", beta: "#0284c7", soon: "#d97706", retired: "#9ca3af" };

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

/** A glyph for the app icon, from what the product is (until a real logo is uploaded in the CMS). */
function glyphFor(p: Product): LucideIcon {
  const t = `${p.slug} ${p.title} ${p.category ?? ""} ${p.tagline}`.toLowerCase();
  if (/dashboard|admin|template/.test(t)) return LayoutDashboard;
  if (/store|shop|commerce|order/.test(t)) return ShoppingBag;
  if (/account|invoice|inventory|pos|sales/.test(t)) return ReceiptText;
  return Package;
}

/** App icon: the product's own logo, else a squircle in its colour with a glyph and a glass highlight. */
function AppIcon({ p }: { p: Product }) {
  const accent = p.accent ?? "#615fff";
  if (p.logo)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.logo} alt="" className="h-12 w-12 shrink-0 rounded-[14px] border border-[#0b0f19]/[0.08] bg-white object-contain p-1.5" />;
  const Glyph = glyphFor(p);
  return (
    <span
      aria-hidden
      className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[14px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.12),0_8px_18px_-8px_rgba(11,15,25,0.45)]"
      style={{ backgroundColor: accent }}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
      <Glyph size={22} strokeWidth={1.8} className="relative" />
    </span>
  );
}

/** The product's screen, zoomed so its interface reads, bleeding off the right and bottom; pans on hover. */
function Screen({ p }: { p: Product }) {
  const accent = p.accent ?? "#615fff";
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-[#0b0f19]/[0.06]"
      style={{ background: `radial-gradient(90% 80% at 100% 0%, ${accent}26, transparent 70%), linear-gradient(180deg, #faf9f7, #f3f2ef)` }}
    >
      <div className="absolute left-[7%] top-[9%] w-[150%] overflow-hidden rounded-tl-[14px] border-l border-t border-[#0b0f19]/[0.08] bg-white shadow-[0_1px_2px_rgba(11,15,25,0.06),0_30px_60px_-24px_rgba(11,15,25,0.35)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[9%] group-hover:-translate-y-[3%]">
        <div className="flex items-center gap-1.5 border-b border-[#0b0f19]/[0.06] bg-[#fafaf9] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="relative aspect-[16/10]">
          <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 640px, 140vw" className="object-cover object-left-top" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsShowcase({ copy }: { copy?: CopyOf<"products"> }) {
  const c = homeCopy("products", copy);
  const list = PRODUCTS.filter((p) => p.stage !== "retired");
  if (!list.length) return null;
  const products = [...list.filter((p) => p.featured), ...list.filter((p) => !p.featured)].slice(0, 6);

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

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {products.map((p, i) => {
            const f = facts(p);
            return (
              <li key={p.slug} className="h-full">
                <Reveal delay={60 + i * 80} className="h-full">
                  <article className="group relative flex h-full flex-col rounded-[28px] border border-[#0b0f19]/[0.07] bg-white p-3 transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#0b0f19]/[0.1] hover:shadow-[0_40px_80px_-48px_rgba(11,15,25,0.4)]">
                    {/* identity */}
                    <div className="flex items-center gap-3.5 px-3 pb-5 pt-3">
                      <AppIcon p={p} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-urbanist text-[20px] font-bold leading-tight tracking-[-0.02em] text-ink">
                          <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none">
                            {p.title}
                          </Link>
                        </h3>
                        <p className="mt-1 flex items-center gap-2 font-urbanist text-[12.5px] text-ink-dim">
                          {p.category}
                          {p.category && <span aria-hidden className="h-0.5 w-0.5 rounded-full bg-ink-dim" />}
                          <span className="inline-flex items-center gap-1.5">
                            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: DOT[p.stage] ?? DOT.retired }} />
                            {STAGE[p.stage] ?? p.stage}
                          </span>
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#0b0f19]/[0.08] text-ink transition-[background-color,color,transform] duration-300 group-hover:rotate-45 group-hover:bg-[#0b0f19] group-hover:text-white"
                      >
                        <ArrowUpRight size={15} strokeWidth={1.9} />
                      </span>
                    </div>

                    <p className="min-h-[3.75em] px-3 pb-6 font-urbanist text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink lg:min-h-[4.25em]">{p.tagline}</p>

                    <Screen p={p} />

                    {/* facts + action */}
                    <div className="mt-auto flex items-end justify-between gap-4 px-3 pb-2 pt-6">
                      <dl className="flex min-w-0 gap-5">
                        {f.map((x) => (
                          <div key={x.label} className="flex flex-col-reverse">
                            <dt className="mt-1 whitespace-nowrap font-urbanist text-[11.5px] leading-tight text-ink-dim">{x.label}</dt>
                            <dd className="whitespace-nowrap font-urbanist text-[18px] font-bold leading-none tracking-[-0.02em] text-ink tabular-nums">{x.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <Link
                        href={p.cta?.href ?? "/contact"}
                        className="relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0b0f19] px-4 py-2 font-urbanist text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1f2433]"
                      >
                        {p.cta?.label ?? (p.stage === "soon" ? "Get early access" : c.demoButton)}
                        <span className="sr-only">: {p.title}</span>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
