"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { SERVICE_COLUMNS } from "@/lib/navigation";
import Reveal from "@/components/system/Reveal";
import Magnetic from "@/components/system/Magnetic";

/**
 * 4.10 Final CTA + form — DARK. Two-column: pitch + "what happens next" left,
 * form right. Static validation styling; submission wired to a stub handler.
 * TODO: real submission endpoint.
 */
const INDUSTRIES = [
  "SaaS", "eCommerce / Retail", "Real Estate", "Logistics", "Travel",
  "Professional Services", "FinTech", "RMG", "Other",
];

const TIMELINES = ["ASAP (2–4 weeks)", "This quarter", "Next quarter", "Exploring options"];

const NEXT_STEPS = [
  { n: "1", text: "Quick call — goals, constraints, honest fit check" },
  { n: "2", text: "Scope + plan — service, engagement model, timeline" },
  { n: "3", text: "Kickoff in ~1 week" },
];

const inputCls =
  "w-full rounded-lg border border-hairline bg-canvas-raised px-4 py-3 font-urbanist text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-aurora-violet/70";

export default function FinalCtaForm() {
  const [submitted, setSubmitted] = useState(false);
  /**
   * Only paint :invalid fields red once the user has actually tried to
   * submit. Native :invalid matches empty required <select>s immediately
   * on mount (there's no :placeholder-shown equivalent for <select> the way
   * there is for <input>/<textarea>), so gating on this avoids every
   * dropdown looking permanently broken before anyone's touched the form.
   */
  const [showErrors, setShowErrors] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /** Stub handler — TODO: wire to real endpoint (API route / CRM). */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  /** Invalid submit attempt: shake the card once (±4px, 300ms) and reveal field errors */
  const onInvalid = () => {
    setShowErrors(true);
    const el = cardRef.current;
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth; // restart animation
    el.classList.add("shake");
  };

  return (
    <section className="relative overflow-hidden bg-canvas py-16 lg:py-32" aria-labelledby="cta-heading">
      {/* restrained glow + hex texture, quiet otherwise */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />
      <div
        aria-hidden
        className="absolute left-1/4 top-1/3 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.16), rgba(255,255,255,0.06), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Left: pitch */}
        <div>
          <Reveal>
            <h2 id="cta-heading" className="font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Tell us your goal — we&apos;ll recommend the best path.
            </h2>
            <p className="mt-6 max-w-lg font-urbanist text-lg leading-relaxed text-ink-dim">
              Share timeline and scope, and we&apos;ll suggest the right service
              and engagement model.
            </p>

            <p className="mt-10 font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
              What happens next
            </p>
          </Reveal>
          <ol className="mt-4 space-y-4">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.n}>
                {/* Steps reveal sequentially; connector draws in below each */}
                <Reveal delay={200 + i * 180}>
                  <span className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-aurora-violet/50 font-urbanist text-xs font-medium text-ink">
                      {s.n}
                    </span>
                    <span className="font-urbanist text-sm leading-relaxed text-ink-dim">{s.text}</span>
                  </span>
                  {i < NEXT_STEPS.length - 1 && (
                    <span className="connector-line mt-3 ml-3.5 block h-px w-10 bg-aurora-violet/30" aria-hidden />
                  )}
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={700}>
            <div className="mt-10">
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-block rounded-full border border-aurora-violet/70 px-7 py-3.5 font-urbanist text-sm font-medium text-ink transition-colors hover:border-aurora-violet"
                >
                  Book a Call →
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        {/* Right: form */}
        <div ref={cardRef} className="card-dark rounded-2xl p-8">
          {submitted ? (
            <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
              <p className="font-urbanist text-2xl font-bold text-ink">Thanks — got it.</p>
              <p className="mt-3 max-w-sm font-urbanist text-sm leading-relaxed text-ink-dim">
                We&apos;ll come back within one business day with a recommended
                path. (Stub confirmation — no data was sent yet.)
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              onInvalid={onInvalid}
              data-show-errors={showErrors}
              className="space-y-5"
              aria-label="Project inquiry"
            >
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
                <textarea
                  name="brief"
                  rows={4}
                  placeholder="What are you trying to build, modernize, or automate?"
                  className={`${inputCls} resize-none`}
                />
              </label>
              <Magnetic className="block w-full">
                <button
                  type="submit"
                  className="w-full rounded-full border border-aurora-violet/70 px-7 py-3.5 font-urbanist text-sm font-medium text-ink transition-colors hover:border-aurora-violet"
                >
                  Start a Project →
                </button>
              </Magnetic>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
