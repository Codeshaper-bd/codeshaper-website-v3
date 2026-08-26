"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Mail } from "lucide-react";

const FALLBACK_ERROR = "Something went wrong — please try again.";

/** Compact sidebar card — lives in BlogBrowser's <aside>, not a full-width section. */
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
    <div className="rounded-2xl border border-hairline-light bg-light-raised p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aurora-violet/10 text-aurora-violet">
        <Mail size={17} strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 font-urbanist text-[15px] font-bold text-ink">Get one useful insight per month</h3>
      <p className="mt-2 font-urbanist text-[13px] leading-relaxed text-ink-dim">
        No spam — just practical checklists, templates, and delivery lessons.
      </p>

      {status === "success" ? (
        <p className="mt-4 font-urbanist text-[13px] font-semibold text-ink">
          You&apos;re in — we&apos;ll send the next one your way.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-2.5">
          <input
            required
            name="email"
            type="email"
            placeholder="you@company.com"
            className="w-full rounded-full border border-hairline-light bg-canvas px-4 py-2.5 font-urbanist text-[13px] text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-aurora-violet/60"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-aurora-violet/70 px-5 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-colors hover:border-aurora-violet disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Subscribe"}
            <ArrowRight size={13} strokeWidth={1.75} />
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-2 font-urbanist text-[12.5px] text-red-500">{errorMessage}</p>}
    </div>
  );
}
