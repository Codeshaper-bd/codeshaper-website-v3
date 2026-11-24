import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { founderBy } from "@/lib/founders";

/**
 * "Founder's note" at the end of an article (owner, 24 Nov 2026): one
 * founder's own words about this article, with their photo, name and title.
 * Set per post in CMS › Post › Key points › Founder's note (who + quote);
 * nothing shows until a real quote is written.
 */
export default function FounderNote({ by, quote }: { by: "founder" | "cofounder"; quote: string }) {
  const p = founderBy(by);
  const first = p.name.split(" ")[0];
  return (
    <figure className="relative isolate mt-10 overflow-hidden rounded-[24px] bg-white p-7 ring-1 ring-hairline-light sm:p-9">
      {/* a soft lilac light in the corner and a large quote mark */}
      <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,#d9d1ff,transparent)] opacity-80" />
      <span aria-hidden className="pointer-events-none absolute right-7 top-2 -z-10 select-none font-urbanist text-[140px] font-bold leading-none text-[#4f46e5]/[0.07] sm:right-9">
        ”
      </span>

      <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4f46e5]">Founder&apos;s note</p>
      <blockquote className="mt-4 max-w-3xl text-balance font-urbanist text-[20px] font-semibold leading-[1.45] tracking-[-0.01em] text-ink sm:text-[23px]">
        “{quote}”
      </blockquote>

      <figcaption className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#0b0f19]/[0.07] pt-6">
        <span className="flex items-center gap-3.5">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#e7e6ea] ring-2 ring-white shadow-[0_6px_16px_-8px_rgba(79,70,229,0.5)]">
            {/* the studio photos are wide: zoom in on the face */}
            <Image src={p.photo} alt="" fill sizes="96px" quality={90} className="origin-[50%_30%] scale-[1.6] object-cover" />
          </span>
          <span>
            <span className="block font-urbanist text-[15.5px] font-bold text-ink">{p.name}</span>
            <span className="block font-urbanist text-[13px] text-ink-dim">{p.title}, CodeShaper</span>
          </span>
        </span>
        <Link
          href="/contact"
          data-booking
          className="group inline-flex items-center gap-1.5 rounded-full border border-hairline-light px-4 py-2 font-urbanist text-[13px] font-semibold text-ink transition-[border-color,background-color] duration-300 hover:border-[#0b0f19]/[0.2] hover:bg-[#fafaf9]"
        >
          Talk to {first}
          <ArrowRight size={13} strokeWidth={2} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </figcaption>
    </figure>
  );
}
