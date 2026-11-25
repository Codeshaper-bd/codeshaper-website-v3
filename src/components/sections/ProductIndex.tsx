"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Homepage › our products as an index (owner, 25 Nov 2026: "the footer's order, more premium, no AI feel").
 * A numbered list on the left, the product's real screen on the right; hovering or focusing a row
 * switches the screen. Editorial and quiet on purpose: hairlines, numbers and real screenshots, no
 * glows, gradients or invented figures. A product without a screenshot shows its name and address.
 */
export type IndexItem = {
  name: string;
  /** the product's own site */
  href: string;
  /** its page on this website, when it has one in the CMS */
  page?: string;
  line?: string;
  category?: string;
  stage?: string;
  image?: string;
  facts?: { value: string; label: string }[];
};

const STAGE_DOT: Record<string, string> = { live: "#16a34a", beta: "#0284c7", soon: "#d97706" };
const STAGE_NAME: Record<string, string> = { live: "Live", beta: "Beta", soon: "Coming soon" };
const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

export default function ProductIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(0);
  const a = items[active] ?? items[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      {/* the index */}
      <ol className="border-t border-[#0b0f19]/[0.08]">
        {items.map((p, i) => {
          const on = i === active;
          return (
            <li key={p.name} className="border-b border-[#0b0f19]/[0.08]">
              <a
                href={p.page ?? p.href}
                {...(p.page ? {} : { target: "_blank", rel: "noopener" })}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-5 outline-none focus-visible:bg-white/60"
              >
                <span className={`font-urbanist text-[12px] font-semibold tabular-nums transition-colors ${on ? "text-ink" : "text-ink-dim"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className={`font-display block text-[22px] font-bold leading-tight tracking-[-0.025em] text-ink transition-colors sm:text-[26px] ${on ? "" : "lg:text-ink/40 lg:group-hover:text-ink"}`}>
                    {p.name}
                  </span>
                  <span className={`mt-1 block font-urbanist text-[13px] text-ink-dim transition-colors lg:truncate ${on ? "" : "lg:text-ink-dim/70"}`}>
                    {p.line ?? host(p.href)}
                  </span>
                </span>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.7}
                  aria-hidden
                  className={`self-center text-ink transition-[transform,color] duration-300 ${on ? "" : "lg:-translate-x-1 lg:text-ink/25 lg:group-hover:translate-x-0 lg:group-hover:text-ink"}`}
                />
              </a>
            </li>
          );
        })}
      </ol>

      {/* the screen (desktop only: on phones the list alone reads better) */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <div className="overflow-hidden rounded-[24px] border border-[#0b0f19]/[0.07] bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[#0b0f19]/[0.06] px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-2.5 font-urbanist text-[13px]">
                <span className="font-semibold text-ink">{a.name}</span>
                {a.category && <span className="truncate text-ink-dim">{a.category}</span>}
                {a.stage && STAGE_NAME[a.stage] && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-ink-dim">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: STAGE_DOT[a.stage] }} />
                    {STAGE_NAME[a.stage]}
                  </span>
                )}
              </div>
              <span className="shrink-0 font-urbanist text-[12px] text-ink-dim">{host(a.href)}</span>
            </div>
            <div className="relative aspect-[16/10] bg-[#f6f5f3]">
              {items.map((p, i) =>
                p.image ? (
                  <Image
                    key={p.name}
                    src={p.image}
                    alt={`${p.name} screen`}
                    fill
                    sizes="(min-width: 1024px) 720px, 0px"
                    className={`object-cover object-left-top transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
                  />
                ) : null,
              )}
              {!a.image && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="font-urbanist text-[56px] font-bold leading-none tracking-[-0.04em] text-ink">{a.name}</p>
                    <p className="mt-3 font-urbanist text-[14px] text-ink-dim">{host(a.href)}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-end justify-between gap-4 px-5 py-4">
              <dl className="flex min-w-0 gap-7">
                {(a.facts ?? []).map((f) => (
                  <div key={f.label} className="flex flex-col-reverse">
                    <dt className="mt-1 font-urbanist text-[11.5px] text-ink-dim">{f.label}</dt>
                    <dd className="font-urbanist text-[19px] font-bold leading-none tracking-[-0.02em] text-ink tabular-nums">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex shrink-0 items-center gap-2">
                {a.page && (
                  <Link href={a.page} className="rounded-full border border-[#0b0f19]/10 px-4 py-2 font-urbanist text-[12.5px] font-semibold text-ink transition-colors hover:bg-[#f6f6f4]">
                    Details
                  </Link>
                )}
                <a href={a.href} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-[#0b0f19] px-4 py-2 font-urbanist text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1f2433]">
                  Visit site
                  <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
