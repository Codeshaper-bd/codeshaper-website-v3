"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { INDUSTRIES as ALL_INDUSTRIES } from "@/lib/navigation";
import { SERVICE_GROUPS } from "@/data/services";
import { ChevronDown } from "lucide-react";
import Magnetic from "@/components/system/Magnetic";

/**
 * Real submission form for the /contact page — adapted from the
 * removed homepage FinalCtaForm (same fields/validation/shake-on-invalid
 * UX). POSTs to /api/contact, which hands the lead to the CMS.
 */
// Derived from the same canonical INDUSTRIES list every industries page/mega
// menu uses, plus "Other" — was previously a separately hand-typed list that
// had already drifted (missing two industries added elsewhere).
const INDUSTRIES = [...ALL_INDUSTRIES.map((i) => i.label), "Other"];

const TIMELINES = ["ASAP (2–4 weeks)", "This quarter", "Next quarter", "Exploring options"];

/** Same field as the homepage booking form: soft at rest, white with an indigo edge and halo on focus. */
const inputCls =
  "w-full rounded-[14px] border border-[#0b0f19]/[0.09] bg-[#fafaf9] px-4 py-3.5 font-urbanist text-[14.5px] text-ink shadow-[inset_0_1px_2px_rgba(11,15,25,0.03)] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#6b7183] hover:border-[#0b0f19]/[0.16] focus:border-[#615fff] focus:bg-white focus:shadow-[0_0_0_4px_rgba(97,95,255,0.12)] focus-visible:outline-none!";
/** Selects: the same field; the chevron is a real icon beside it (see Select). */
const selectCls = `${inputCls} appearance-none pr-10 cursor-pointer`;
const labelCls = "mb-1.5 block font-urbanist text-[12.5px] font-semibold text-ink";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  // one id per enquiry: sending twice never saves it twice
  const submissionId = useRef("");

  // Prefill the brief from the homepage hero prompt (/contact?brief=...).
  useEffect(() => {
    const brief = new URLSearchParams(window.location.search).get("brief");
    if (brief && briefRef.current && !briefRef.current.value) briefRef.current.value = brief.slice(0, 1000);
  }, []);

  const FALLBACK_ERROR = "Something went wrong sending that — please try again.";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    submissionId.current ||= crypto.randomUUID?.() ?? "";
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submission_id: submissionId.current }),
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

  const onInvalid = () => {
    setShowErrors(true);
    const el = cardRef.current;
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  };

  return (
    <div ref={cardRef} className="rounded-[28px] border border-[#0b0f19]/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(11,15,25,0.04),0_30px_60px_-40px_rgba(11,15,25,0.35)] sm:p-8">
      {status === "success" ? (
        <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
          <p className="font-urbanist text-2xl font-bold text-ink">Thanks — got it.</p>
          <p className="mt-3 max-w-sm font-urbanist text-sm leading-relaxed text-ink-dim">
            We&apos;ll come back within one business day with a recommended path.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} onInvalid={onInvalid} data-show-errors={showErrors} className="space-y-5" aria-label="Project inquiry">
          <input name="company_website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Name</span>
              <input required name="name" type="text" placeholder="Your name" className={inputCls} />
            </label>
            <label className="block">
              <span className={labelCls}>Email</span>
              <input required name="email" type="email" placeholder="you@company.com" className={inputCls} />
            </label>
          </div>
          <label className="block">
            <span className={labelCls}>Service interest</span>
            <span className="relative block">
              <select required name="service" defaultValue="" className={selectCls}>
              <option value="" disabled>Select a service…</option>
              {SERVICE_GROUPS.map((g) => (
                <option key={g.slug} value={g.slug}>{g.name}</option>
              ))}
            </select>
              <ChevronDown size={16} strokeWidth={2} aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint" />
            </span>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Industry</span>
              <span className="relative block">
              <select required name="industry" defaultValue="" className={selectCls}>
                <option value="" disabled>Select…</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <ChevronDown size={16} strokeWidth={2} aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint" />
            </span>
            </label>
            <label className="block">
              <span className={labelCls}>Timeline</span>
              <span className="relative block">
              <select required name="timeline" defaultValue="" className={selectCls}>
                <option value="" disabled>Select…</option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={16} strokeWidth={2} aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint" />
            </span>
            </label>
          </div>
          <label className="block">
            <span className={labelCls}>Short brief</span>
            <textarea ref={briefRef} name="brief" rows={4} placeholder="What are you trying to build, modernize, or automate?" className={`${inputCls} resize-none`} />
          </label>
          {status === "error" && (
            <p className="font-urbanist text-sm text-red-600">{errorMessage}</p>
          )}
          <Magnetic className="block w-full">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full bg-[#0b0f19] px-7 py-3.5 font-urbanist text-[14px] font-semibold text-white transition-colors hover:bg-[#1f2433] disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Start a Project →"}
            </button>
          </Magnetic>
        </form>
      )}
    </div>
  );
}
