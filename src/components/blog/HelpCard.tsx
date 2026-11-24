import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bothFounders, whoLabel, CALL_MINUTES } from "@/lib/founders";

/**
 * The article rail's call to action: the free founder call, always with
 * both founders (owner, 24 Nov 2026; the page-end CTA follows the CMS
 * setting, CMS › Pages › Blog › Founder call), as a full
 * mesh-gradient card in the footer's colour family, dark ink and a black
 * button like the rest of the light design system.
 */
const MESH = [
  "radial-gradient(80% 65% at 0% 0%, #9d8cff 0%, transparent 70%)",
  "radial-gradient(70% 60% at 100% 0%, #7fbcff 0%, transparent 70%)",
  "radial-gradient(85% 70% at 100% 100%, #ffa77d 0%, transparent 72%)",
  "radial-gradient(70% 60% at 0% 100%, #c58cff 0%, transparent 70%)",
  "#cfc6ff",
].join(", ");

export default function HelpCard({ title, href }: { title?: string; label?: string; href: string }) {
  const people = bothFounders();
  return (
    <div className="group relative isolate overflow-hidden rounded-[22px] p-5 shadow-[0_18px_40px_-24px_rgba(79,70,229,0.45)] ring-1 ring-white/60" style={{ background: MESH }}>
      {/* a soft light that drifts on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full bg-white/50 blur-2xl transition-transform duration-700 ease-out group-hover:-translate-x-6 group-hover:translate-y-6"
      />
      <ul className="flex -space-x-2.5" aria-label={people.map((p) => `${p.name}, ${p.title}`).join(" and ")}>
        {people.map((m) => (
          <li key={m.photo} className="relative h-11 w-11 overflow-hidden rounded-full bg-[#e7e6ea] ring-[3px] ring-white/90">
            {/* the studio photos are wide: zoom in on the face */}
            <Image src={m.photo} alt={m.name} title={`${m.name}, ${m.title}`} fill sizes="88px" className="origin-[50%_30%] scale-[1.75] object-cover" />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-balance font-urbanist text-[20px] font-bold leading-[1.2] tracking-[-0.015em] text-[#0b0f19]">{title ?? "Need help shipping this?"}</p>
      <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-[#1f2433]">
        Free {CALL_MINUTES}-minute call, one to one with {whoLabel(people)}.
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#0b0f19] px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(11,15,25,0.6)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#1f2433]"
      >
        Book a free call
        <ArrowRight size={13} strokeWidth={1.9} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
