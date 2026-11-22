import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STAGE, type Product } from "@/lib/products";

export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link href={`/products/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline-light bg-light-raised transition-colors hover:border-aurora-violet/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <span className="block aspect-[16/10] overflow-hidden"><img src={p.image} alt={p.imageAlt ?? ""} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" /></span>
      <span className="flex flex-1 flex-col p-6">
        <span className="flex items-center justify-between gap-3"><span className="rounded-full bg-aurora-violet/10 px-3 py-1 font-urbanist text-[12px] font-semibold text-aurora-violet">{STAGE[p.stage] ?? p.stage}</span><ArrowUpRight size={16} className="text-ink-faint transition-colors group-hover:text-aurora-violet" /></span>
        <span className="mt-4 font-urbanist text-xl font-bold text-ink">{p.title}</span>
        <span className="mt-1.5 font-urbanist text-[14.5px] leading-relaxed text-ink-dim">{p.tagline}</span>
      </span>
    </Link>
  );
}
