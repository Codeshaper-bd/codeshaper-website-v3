import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { heroInter } from "@/components/hero/heroFont";

/**
 * DEV ONLY: hero typography comparison, current site font (Urbanist) vs
 * Inter, with identical copy, sizes, weights and layout. Returns 404 in
 * production builds. Delete this route once the font decision is final.
 */
export const metadata: Metadata = { title: "Hero font comparison (dev)", robots: { index: false, follow: false } };

const EYEBROW = "AI Automation · Digital Products · Scalable Platforms";
const SUBTITLE =
  "We design and engineer AI solutions, digital products, and scalable platforms that transform the way businesses operate and grow.";

function Sample({ label, fontClass, note }: { label: string; fontClass: string; note: string }) {
  return (
    <section className={`rounded-[24px] border border-black/10 bg-white px-6 py-12 text-center ${fontClass}`}>
      <p className="mb-8 font-mono text-[12px] text-[#626873]">
        {label} · {note}
      </p>
      <p className="inline-flex items-center gap-2 rounded-full border border-[#0b0f19]/[0.08] px-3.5 py-1.5 text-[12px] font-medium uppercase leading-none tracking-[0.12em] text-[#525a6c]">
        {EYEBROW}
      </p>
      <h2 className="mt-7 text-[56px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#0b0f19]">
        <span className="block">From AI automation to</span>
        <span className="block">scalable digital products,</span>
        <span className="block text-[#363d4f]">we build the future.</span>
      </h2>
      <p className="mx-auto mt-7 max-w-[600px] text-[19px] leading-[1.65] text-[#434a5c]">{SUBTITLE}</p>
      <div className="mt-8 flex justify-center gap-3">
        <span className="inline-flex h-12 items-center rounded-full bg-[#0b0f19] px-6 text-[15px] font-semibold text-white">
          Book a Call →
        </span>
        <span className="inline-flex h-12 items-center rounded-full border border-[#0b0f19]/[0.12] px-6 text-[15px] font-semibold text-[#0b0f19]">
          Explore Services →
        </span>
      </div>
    </section>
  );
}

export default function HeroFontComparison() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="min-h-screen bg-[#f5f4f2] p-6 text-[#0b0f19]">
      <h1 className="mb-6 font-mono text-[13px]">Hero typography comparison (dev only, not built for production)</h1>
      <div className="grid gap-6 2xl:grid-cols-2">
        <Sample label="Current: Urbanist" fontClass="font-urbanist" note="site-wide font today" />
        <Sample label="Proposed: Inter (variable)" fontClass={heroInter.className} note="used by the refined hero" />
      </div>
    </main>
  );
}
