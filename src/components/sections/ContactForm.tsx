"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { SERVICE_GROUPS } from "@/data/services";
import { Code2, Globe, HelpCircle, LifeBuoy, MessageCircleQuestion, Network, Package, PenTool, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import Magnetic from "@/components/system/Magnetic";
import { takeBrief } from "@/lib/briefHandoff";
import ListSelect, { type ListOption } from "@/components/system/ListSelect";
import { BUDGETS, CONTACT_REASONS, NEW_PROJECT, type ContactReason } from "@/lib/contactOptions";

const REASON_META: Record<ContactReason, { icon: LucideIcon; hint: string }> = {
  "Start a New Project": { icon: Rocket, hint: "Build, rebuild or extend a product" },
  "Make a General Query": { icon: MessageCircleQuestion, hint: "Questions about us or how we work" },
  "Get Support": { icon: LifeBuoy, hint: "Help with something we built for you" },
};
const REASON_OPTIONS: ListOption[] = CONTACT_REASONS.map((r) => ({ value: r, label: r, ...REASON_META[r] }));
/** Only the icons the service groups use (the full icon map would add weight); unknown keys get a neutral box. */
const GLYPH: Record<string, LucideIcon> = { sparkles: Sparkles, "code-2": Code2, network: Network, "pen-tool": PenTool, globe: Globe };
const SERVICE_OPTIONS: ListOption[] = [
  ...SERVICE_GROUPS.map((g) => ({ value: g.slug, label: g.name, icon: GLYPH[g.icon] ?? Package })),
  { value: "other", label: "Other", icon: HelpCircle },
];
const BUDGET_OPTIONS: ListOption[] = BUDGETS.map((b) => ({ value: b, label: b }));

/**
 * Real submission form for the /contact page and the booking window. POSTs to
 * /api/contact, which hands the lead to the CMS.
 *
 * Fields follow the old codeshaper.net form (owner, 24 Nov 2026): name; phone
 * and email; why you are writing; for a new project, what you are looking for
 * and an approximate budget; the message. The design is ours.
 */

/** Same field as the homepage booking form: soft at rest, white with an indigo edge and halo on focus. */
const inputCls =
  "w-full rounded-control border border-[#0b0f19]/[0.12] bg-white px-3.5 py-2.5 font-urbanist text-[14.5px] text-ink shadow-[0_1px_1px_rgba(11,15,25,0.04),0_2px_5px_-2px_rgba(11,15,25,0.06)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#8a8fa0] hover:border-[#0b0f19]/[0.2] focus:border-[#615fff] focus:shadow-[0_0_0_3px_rgba(97,95,255,0.2),0_1px_1px_rgba(11,15,25,0.04)] focus-visible:outline-none!";
// Stripe-like: a quiet medium-weight label close to its field
const labelCls = "mb-1.5 block font-urbanist text-[13px] font-medium text-ink-mid";

/** bare: no card of its own (inside the booking window); formId: unique when two forms can be on a page */
export default function ContactForm({ bare = false, formId = "contact-form" }: { bare?: boolean; formId?: string } = {}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [reason, setReason] = useState<ContactReason>(NEW_PROJECT);
  const isProject = reason === NEW_PROJECT;
  const cardRef = useRef<HTMLDivElement>(null);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  // one id per enquiry: sending twice never saves it twice
  const submissionId = useRef("");

  // Prefill the message from the hero box or a "Start a project" button (lib/briefHandoff).
  useEffect(() => {
    // an old bookmark may still carry words in its address: take them out of the address bar, unused
    const url = new URL(window.location.href);
    if (url.searchParams.has("brief")) {
      url.searchParams.delete("brief");
      window.history.replaceState(window.history.state, "", url);
    }
    if (briefRef.current && !briefRef.current.value) {
      const brief = takeBrief();
      if (brief) briefRef.current.value = brief;
    }
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
    <div ref={cardRef} className={bare ? "" : "rounded-[28px] border border-[#0b0f19]/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(11,15,25,0.04),0_30px_60px_-40px_rgba(11,15,25,0.35)] sm:p-8"}>
      {status === "success" ? (
        <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
          <p className="font-urbanist text-2xl font-bold text-ink">Thanks — got it.</p>
          <p className="mt-3 max-w-sm font-urbanist text-sm leading-relaxed text-ink-dim">
            We&apos;ll come back within one business day with a recommended path.
          </p>
        </div>
      ) : (
        <form id={formId} action="/contact/continue" method="post" onSubmit={onSubmit} onInvalid={onInvalid} data-show-errors={showErrors} className="scroll-mt-28 space-y-4" aria-label="Project inquiry">
          <input name="company_website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
          <label className="block">
            <span className={labelCls}>Name</span>
            <input required name="name" type="text" autoComplete="name" placeholder="Your name" className={inputCls} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>
                Phone number <span className="font-medium text-ink-faint">(optional)</span>
              </span>
              <input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="+1 555 000 0000" className={inputCls} />
            </label>
            <label className="block">
              <span className={labelCls}>Email</span>
              <input required name="email" type="email" autoComplete="email" placeholder="you@company.com" className={inputCls} />
            </label>
          </div>
          <ListSelect name="reason" label="What can we help with?" required options={REASON_OPTIONS} value={reason} onChange={(v) => setReason(v as ContactReason)} />
          {/* a new project: what and roughly how much (the old form's two extra questions) */}
          {isProject && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ListSelect name="service" label="What are you looking for?" required placeholder="Select a service…" options={SERVICE_OPTIONS} />
              <ListSelect name="budget" label="Approximate budget" required placeholder="Select a range…" options={BUDGET_OPTIONS} />
            </div>
          )}
          <label className="block">
            <span className={labelCls}>Message</span>
            <textarea
              ref={briefRef}
              required
              name="brief"
              rows={3}
              placeholder={isProject ? "What are you trying to build, modernize, or automate?" : reason === "Get Support" ? "Tell us what you need help with." : "How can we help?"}
              className={`${inputCls} resize-none`}
            />
          </label>
          {status === "error" && (
            <p className="font-urbanist text-sm text-red-600">{errorMessage}</p>
          )}
          <Magnetic className="block w-full">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-1 w-full rounded-full bg-[#0b0f19] px-7 py-3 font-urbanist text-[14px] font-semibold text-white transition-colors hover:bg-[#1f2433] disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : isProject ? "Start a project →" : "Send message →"}
            </button>
          </Magnetic>
        </form>
      )}
    </div>
  );
}

