"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { SERVICE_GROUPS } from "@/data/services";

/**
 * The short booking form in "Let's talk" (homepage): four fields instead of
 * the contact page's six, so asking for a call takes under a minute. Posts to
 * the same /api/contact as the contact page, so every request lands in CMS ›
 * Leads with the same checks (honeypot, one id per enquiry: sending twice
 * never saves it twice).
 */
const field =
  "w-full rounded-xl border border-[#0b0f19]/10 bg-white px-4 py-3 font-urbanist text-[14px] text-ink placeholder:text-ink-faint outline-none transition-[border-color,box-shadow] focus:border-[#615fff]/60 focus:shadow-[0_0_0_4px_rgba(97,95,255,0.12)]";
const label = "mb-1.5 block font-urbanist text-[12.5px] font-semibold text-ink";

export default function BookingForm({ title, text, button }: { title: string; text: string; button: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const id = useRef("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    id.current ||= crypto.randomUUID?.() ?? "";
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, timeline: "Asked for a call (homepage)", submission_id: id.current }),
      });
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
    <div className="rounded-[28px] border border-[#0b0f19]/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(11,15,25,0.04),0_30px_60px_-40px_rgba(11,15,25,0.35)] sm:p-8">
      {status === "done" ? (
        <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ecfdf5] text-[#16a34a]">
            <Check size={22} strokeWidth={2.4} aria-hidden />
          </span>
          <p className="mt-5 font-urbanist text-[22px] font-bold tracking-tight text-ink">Thanks, we have it.</p>
          <p className="mt-2 max-w-xs font-urbanist text-[14px] leading-relaxed text-ink-dim">We&apos;ll come back within one business day to set up the call.</p>
        </div>
      ) : (
        <>
          <h3 className="font-urbanist text-[22px] font-bold tracking-tight text-ink">{title}</h3>
          <p className="mt-1.5 font-urbanist text-[14px] leading-relaxed text-ink-dim">{text}</p>
          <form onSubmit={submit} className="mt-6 space-y-4" aria-label={title}>
            <input name="company_website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Name</span>
                <input required name="name" type="text" autoComplete="name" placeholder="Your name" className={field} />
              </label>
              <label className="block">
                <span className={label}>Work email</span>
                <input required name="email" type="email" autoComplete="email" placeholder="you@company.com" className={field} />
              </label>
            </div>
            <label className="block">
              <span className={label}>What do you need?</span>
              <select required name="service" defaultValue="" className={`${field} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7183%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10`}>
                <option value="" disabled>
                  Choose a service
                </option>
                {SERVICE_GROUPS.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={label}>
                About the project <span className="font-normal text-ink-faint">(optional)</span>
              </span>
              <textarea name="brief" rows={3} placeholder="A few lines on what you want to build or improve" className={`${field} resize-none`} />
            </label>
            {status === "error" && <p className="font-urbanist text-[13px] text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="group/cta mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0f19] py-2.5 pl-6 pr-2.5 font-urbanist text-[14px] font-semibold text-white transition-colors hover:bg-[#1f2433] disabled:opacity-60"
            >
              <span className="flex-1 text-center">{status === "sending" ? "Sending…" : button}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover/cta:rotate-45">
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
              </span>
            </button>
            <p className="text-center font-urbanist text-[12px] text-ink-faint">We only use your details to reply to you.</p>
          </form>
        </>
      )}
    </div>
  );
}
