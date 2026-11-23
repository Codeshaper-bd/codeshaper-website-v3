import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import { PRODUCTS, STAGE, type Product } from "@/lib/products";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";

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

function specs(p: Product): [string, string][] {
  const proof = (p.stats ?? []).find((s) => /\d/.test(s.value));
  const rows: [string, string | undefined][] = [
    ["Platforms", p.platforms?.join(" · ")],
    ["Pricing", price(p)],
    [
      "Track record",
      proof ? `${proof.value} ${proof.label.charAt(0).toLowerCase()}${proof.label.slice(1)}` : p.stage === "soon" ? "Launching soon" : undefined,
    ],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

function AppIcon({ p }: { p: Product }) {
  const accent = p.accent ?? "#615fff";
  return p.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.logo} alt="" className="h-11 w-11 shrink-0 rounded-[12px] border border-[#0b0f19]/[0.08] bg-white object-contain p-1.5" />
  ) : (
    <span
      aria-hidden
      className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] font-urbanist text-[19px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_6px_14px_-8px_rgba(11,15,25,0.5)]"
      style={{ backgroundColor: accent }}
    >
      {p.title[0]}
    </span>
  );
}

export default function ProductsShowcase({ copy }: { copy?: CopyOf<"products"> }) {
  const c = homeCopy("products", copy);
  const list = PRODUCTS.filter((p) => p.stage !== "retired");
  if (!list.length) return null;
  const products = [...list.filter((p) => p.featured), ...list.filter((p) => !p.featured)].slice(0, 6);

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section aria-labelledby="products-heading" className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
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
              const rows = specs(p);
              return (
                <li key={p.slug} className="h-full">
                  <Reveal delay={60 + i * 80} className="h-full">
                    <div className="group relative flex h-full flex-col rounded-[28px] border border-[#0b0f19]/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(11,15,25,0.04)] transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#0b0f19]/[0.12] hover:shadow-[0_30px_60px_-36px_rgba(11,15,25,0.35)]">
                      {/* the product's screen, flat */}
                      <Link
                        href={`/products/${p.slug}`}
                        tabIndex={-1}
                        aria-hidden
                        className="relative block aspect-[16/10] overflow-hidden rounded-[20px] border border-[#0b0f19]/[0.06] bg-[#f6f4f1]"
                      >
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 92vw"
                          className="object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col px-4 pb-4 pt-6 sm:px-5">
                        {/* identity */}
                        <div className="flex items-center gap-3.5">
                          <AppIcon p={p} />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-urbanist text-[19px] font-bold leading-tight tracking-tight text-ink">
                              <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                                {p.title}
                              </Link>
                            </h3>
                            {p.category && <p className="mt-0.5 font-urbanist text-[12.5px] text-ink-dim">{p.category}</p>}
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#0b0f19]/[0.08] px-2.5 py-1 font-urbanist text-[11.5px] font-medium text-ink">
                            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: DOT[p.stage] ?? DOT.retired }} />
                            {STAGE[p.stage] ?? p.stage}
                          </span>
                        </div>

                        <p className="mt-5 font-urbanist text-[16px] font-semibold leading-snug tracking-[-0.01em] text-ink">{p.tagline}</p>

                        {/* spec sheet */}
                        {rows.length > 0 && (
                          <dl className="mt-5 divide-y divide-[#0b0f19]/[0.07] border-y border-[#0b0f19]/[0.07] font-urbanist text-[13px]">
                            {rows.map(([k, v]) => (
                              <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                                <dt className="shrink-0 text-ink-faint">{k}</dt>
                                <dd className="text-right font-medium text-ink">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        <div className="relative z-10 mt-auto flex items-center justify-between gap-4 pt-6">
                          <Link
                            href={p.cta?.href ?? "/contact"}
                            className="group/cta inline-flex items-center gap-2 rounded-full bg-[#0b0f19] py-1.5 pl-4 pr-1.5 font-urbanist text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2433]"
                          >
                            {p.cta?.label ?? (p.stage === "soon" ? "Get early access" : c.demoButton)}
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover/cta:rotate-45">
                              <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
                            </span>
                            <span className="sr-only">: {p.title}</span>
                          </Link>
                          <span
                            aria-hidden
                            className="inline-flex items-center gap-1 font-urbanist text-[13px] font-semibold text-ink-dim transition-colors duration-300 group-hover:text-ink"
                          >
                            {c.viewButton}
                            <ArrowRight size={14} strokeWidth={1.9} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
