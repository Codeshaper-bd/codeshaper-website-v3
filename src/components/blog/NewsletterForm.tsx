"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

const ROLES = ["Founder", "Product Manager", "CTO / Engineering Lead", "Designer", "Ops"];
const FALLBACK_ERROR = "Something went wrong — please try again.";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setErrorMessage(typeof body?.error === "string" ? body.error : FALLBACK_ERROR);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage(FALLBACK_ERROR);
      setStatus("error");
    }
  };

  return (
    <section id="newsletter" className="border-t border-hairline-light bg-light-surface py-14 lg:py-20">
      <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">Newsletter</SectionEyebrow>
          <SectionTitle className="mx-auto">Get one useful insight per month</SectionTitle>
          <SectionDescription className="mx-auto mt-3">
            No spam — just practical checklists, templates, and delivery lessons.
          </SectionDescription>
        </Reveal>

        <Reveal delay={100}>
          {status === "success" ? (
            <p className="mt-8 font-urbanist text-sm font-semibold text-ink">
              You&apos;re in — we&apos;ll send the next one your way.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <input
                required
                name="email"
                type="email"
                placeholder="you@company.com"
                className="flex-1 rounded-full border border-hairline-light bg-light-raised px-5 py-3 font-urbanist text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-aurora-violet/60"
              />
              <select
                name="role"
                defaultValue=""
                className="rounded-full border border-hairline-light bg-light-raised px-4 py-3 font-urbanist text-sm text-ink-dim outline-none"
              >
                <option value="" disabled>Role</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-aurora-violet/70 px-6 py-3 font-urbanist text-sm font-semibold text-ink transition-colors hover:border-aurora-violet disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Subscribe"}
                <ArrowRight size={14} strokeWidth={1.75} />
              </button>
            </form>
          )}
          {status === "error" && <p className="mt-3 font-urbanist text-sm text-red-500">{errorMessage}</p>}
        </Reveal>
      </div>
    </section>
  );
}
