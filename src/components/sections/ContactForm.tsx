"use client";

import { useRef, useState, type FormEvent } from "react";
import { SERVICE_COLUMNS, INDUSTRIES as ALL_INDUSTRIES } from "@/lib/navigation";
import Magnetic from "@/components/system/Magnetic";

/**
 * Real submission form for the /contact page — adapted from the
 * removed homepage FinalCtaForm (same fields/validation/shake-on-invalid
 * UX, which was already solid), now POSTing to /api/contact instead of
 * a client-only stub. See that route's own header for what's still
 * pending on the backend side (email/CRM forwarding).
 */
// Derived from the same canonical INDUSTRIES list every industries page/mega
// menu uses, plus "Other" — was previously a separately hand-typed list that
// had already drifted (missing two industries added elsewhere).
const INDUSTRIES = [...ALL_INDUSTRIES.map((i) => i.label), "Other"];

const TIMELINES = ["ASAP (2–4 weeks)", "This quarter", "Next quarter", "Exploring options"];

const inputCls =
  "w-full rounded-lg border border-hairline bg-canvas-raised px-4 py-3 font-urbanist text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-aurora-violet/70";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const FALLBACK_ERROR = "Something went wrong sending that — please try again.";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
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

  const onInvalid = () => {
    setShowErrors(true);
    const el = cardRef.current;
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  };

  return (
    <div ref={cardRef} className="card-dark rounded-2xl p-8">
      {status === "success" ? (
        <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
          <p className="font-urbanist text-2xl font-bold text-ink">Thanks — got it.</p>
          <p className="mt-3 max-w-sm font-urbanist text-sm leading-relaxed text-ink-dim">
            We&apos;ll come back within one business day with a recommended path.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} onInvalid={onInvalid} data-show-errors={showErrors} className="space-y-5" aria-label="Project inquiry">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-urbanist text-xs font-medium text-ink-dim">Name</span>
              <input required name="name" type="text" placeholder="Your name" className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-urbanist text-xs font-medium text-ink-dim">Email</span>
              <input required name="email" type="email" placeholder="you@company.com" className={inputCls} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block font-urbanist text-xs font-medium text-ink-dim">Service interest</span>
            <select required name="service" defaultValue="" className={inputCls}>
              <option value="" disabled>Select a service…</option>
              {SERVICE_COLUMNS.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-urbanist text-xs font-medium text-ink-dim">Industry</span>
              <select required name="industry" defaultValue="" className={inputCls}>
                <option value="" disabled>Select…</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block font-urbanist text-xs font-medium text-ink-dim">Timeline</span>
              <select required name="timeline" defaultValue="" className={inputCls}>
                <option value="" disabled>Select…</option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block font-urbanist text-xs font-medium text-ink-dim">Short brief</span>
            <textarea name="brief" rows={4} placeholder="What are you trying to build, modernize, or automate?" className={`${inputCls} resize-none`} />
          </label>
          {status === "error" && (
            <p className="font-urbanist text-sm text-red-400">{errorMessage}</p>
          )}
          <Magnetic className="block w-full">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full border border-aurora-violet/70 px-7 py-3.5 font-urbanist text-sm font-medium text-ink transition-colors hover:border-aurora-violet disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Start a Project →"}
            </button>
          </Magnetic>
        </form>
      )}
    </div>
  );
}
