"use client";

import { useState } from "react";
import { ArrowUpRight, Map, X } from "lucide-react";
import LocalTime from "@/components/sections/footer/LocalTime";

/**
 * One office as a quiet row: what and where on the left, local time and two
 * small map actions on the right. "Show map" opens the map under the row and
 * only then loads it (Google is not called until a visitor asks).
 */
export type OfficeRowData = { key: string; role: string; name: string; place?: string; address: string; tel?: string; zone?: string; embed: string; link: string };

const digits = (v: string) => v.replace(/[^+\d]/g, "");
const iconBtn =
  "grid h-9 w-9 place-items-center rounded-full border border-[#0b0f19]/[0.1] bg-white text-ink-mid transition-colors hover:border-[#0b0f19]/[0.22] hover:text-ink";

export default function OfficeRow({ o }: { o: OfficeRowData }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-t border-[#0b0f19]/[0.08] py-6 first:border-t-0 first:pt-0">
      <div className="grid items-start gap-x-5 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="font-urbanist text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#4f46e5]">{o.role}</p>
          <h3 className="mt-1 font-urbanist text-[20px] font-bold leading-tight text-ink">
            {o.name}
            {o.place && <span className="font-semibold text-ink-dim">, {o.place}</span>}
          </h3>
          <p className="mt-1.5 font-urbanist text-[14.5px] leading-relaxed text-ink-mid">{o.address}</p>
          {o.tel && (
            <a href={`tel:${digits(o.tel)}`} className="mt-1 inline-block font-urbanist text-[14.5px] font-semibold text-ink underline decoration-[#0b0f19]/15 underline-offset-4 hover:decoration-[#4f46e5]">
              {o.tel}
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 sm:pt-4">
          {o.zone && (
            <span className="mr-1 font-urbanist text-[13px] font-medium text-ink-dim">
              <LocalTime zone={o.zone} />
            </span>
          )}
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? `Hide the ${o.name} map` : `Show the ${o.name} map`} title={open ? "Hide map" : "Show map"} className={`${iconBtn} ${open ? "border-[#4f46e5]/40 text-[#4f46e5]" : ""}`}>
            {open ? <X size={16} aria-hidden /> : <Map size={16} aria-hidden />}
          </button>
          <a href={o.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${o.name} in Google Maps`} title="Open in Google Maps" className={iconBtn}>
            <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>
      </div>
      {open && (
        <div className="mt-5 overflow-hidden rounded-[18px] border border-[#0b0f19]/[0.07] bg-[#f3f2f7]">
          <iframe title={`Map of the ${o.name} office`} src={o.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block h-[260px] w-full border-0" />
        </div>
      )}
    </li>
  );
}
