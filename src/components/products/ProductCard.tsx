import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LineupCard } from "@/lib/products";

/** A product on /products: its screen, a badge (stage, or the site's address), name and one line. */
export default function ProductCard({ card: p }: { card: LineupCard }) {
  const inner = (
    <>
      <span className="block aspect-[16/10] overflow-hidden border-b border-hairline-light bg-[#f6f5f3]">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={`${p.title} screen`} loading="lazy" className="h-full w-full object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]" />
        ) : (
          <span className="grid h-full place-items-center font-urbanist text-3xl font-bold text-ink">{p.title}</span>
        )}
      </span>
      <span className="flex flex-1 flex-col p-6">
        <span className="flex items-center justify-between gap-3">
          <span className="truncate rounded-full bg-aurora-violet/10 px-3 py-1 font-urbanist text-[12px] font-semibold text-aurora-violet">{p.badge}</span>
          <ArrowUpRight size={16} className="shrink-0 text-ink-faint transition-colors group-hover:text-aurora-violet" />
        </span>
        <span className="mt-4 font-urbanist text-xl font-bold text-ink">{p.title}</span>
        {p.line && <span className="mt-1.5 font-urbanist text-[14.5px] leading-relaxed text-ink-dim">{p.line}</span>}
      </span>
    </>
  );
  const cls = "group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline-light bg-light-raised transition-colors hover:border-aurora-violet/40";
  return p.external ? (
    <a href={p.href} target="_blank" rel="noopener" className={cls}>{inner}</a>
  ) : (
    <Link href={p.href} className={cls}>{inner}</Link>
  );
}
