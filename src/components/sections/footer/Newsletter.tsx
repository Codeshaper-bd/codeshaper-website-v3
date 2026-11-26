"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import DotField from "@/components/sections/human-ai-flow/DotField";

/**
 * Newsletter, on every page right above the footer (default page background
 * with the shared dots). Its bottom edge has no line: the footer's gradient
 * rises out of the same background, so the two read as one closing block.
 * Saves to CMS › Subscribers through /api/newsletter (same as the blog's
 * sidebar form). Honest words only: no subscriber counts, no send schedule.
 */
const COPY = {
  eyebrow: "Newsletter",
  title: "Field notes, straight to your inbox.",
  text: "New articles on AI, software and product, when we publish them. We only use your email to send you those.",
  button: "Subscribe",
  done: "You're subscribed. The next article will find you.",
};

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(typeof body?.error === "string" ? body.error : "Something went wrong. Please try again.");
        return setStatus("error");
      }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section aria-labelledby="newsletter-heading" className="theme-light relative overflow-clip bg-light-surface pb-10 pt-16 lg:pb-14 lg:pt-24">
      {/* dots fade in from the top and are gone before the footer's colour begins */}
      <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_30%,black_55%,transparent_90%)]" />
      <div className="relative mx-auto grid max-w-7xl items-end gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16 lg:px-10">
        <Reveal>
          <SectionEyebrow>{COPY.eyebrow}</SectionEyebrow>
          <SectionTitle id="newsletter-heading" className="max-w-[16ch] text-balance">
            {COPY.title}
          </SectionTitle>
        </Reveal>

        <Reveal delay={100}>
          <p className="max-w-[46ch] font-urbanist text-[15px] leading-relaxed text-ink-dim">{COPY.text}</p>
          {status === "done" ? (
            <p role="status" className="mt-5 flex items-center gap-3 rounded-full border border-[#16a34a]/20 bg-white py-2 pl-2 pr-5 font-urbanist text-[14px] font-medium text-ink">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ecfdf5] text-[#16a34a]">
                <Check size={17} strokeWidth={2.4} aria-hidden />
              </span>
              {COPY.done}
            </p>
          ) : (
            <form action="/newsletter/subscribe" method="post" onSubmit={submit} className="mt-5" aria-label="Subscribe to the newsletter">
              <input name="company_website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
              <div className="group/nl flex items-center gap-2 rounded-full border border-[#0b0f19]/[0.09] bg-white p-1.5 pl-5 shadow-[0_1px_2px_rgba(11,15,25,0.04),0_18px_40px_-28px_rgba(11,15,25,0.35)] transition-[border-color,box-shadow] duration-200 hover:border-[#0b0f19]/[0.16] focus-within:border-[#615fff] focus-within:shadow-[0_0_0_4px_rgba(97,95,255,0.12),0_18px_40px_-28px_rgba(11,15,25,0.35)]">
                <label htmlFor="newsletter-email" className="sr-only">
                  Work email
                </label>
                <input
                  id="newsletter-email"
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 bg-transparent py-2 font-urbanist text-[15px] text-ink outline-none placeholder:text-[#6b7183] focus-visible:outline-none!"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group/btn inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0b0f19] py-2.5 pl-5 pr-3 font-urbanist text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1f2433] disabled:opacity-60"
                >
                  {status === "sending" ? "Subscribing…" : COPY.button}
                  <ArrowRight size={15} strokeWidth={2} aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </button>
              </div>
              {status === "error" && <p className="mt-2 pl-5 font-urbanist text-[13px] text-red-600">{error}</p>}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
