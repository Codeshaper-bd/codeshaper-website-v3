import { Compass, PhoneCall, Rocket } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import BookingForm from "@/components/sections/BookingForm";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";

/**
 * Homepage › let's talk: the page's closing move, on the page background
 * (owner's alternating plan). Left, what working with us looks like in three
 * steps; right, a short booking form, so the visitor can ask for a call
 * without leaving the page. Step 3 repeats only what the Engagement models
 * table already promises for every model (start in 3–10 days, weekly demos,
 * shared backlog, one point of contact). The words come from the CMS
 * (Pages › Home › Let's talk).
 */
const ICONS = [PhoneCall, Compass, Rocket];

export default function LetsTalk({ copy }: { copy?: CopyOf<"letsTalk"> }) {
  const c = homeCopy("letsTalk", copy);
  const base = homeCopy("letsTalk").steps;
  const steps = base.map((s, i) => ({ ...s, ...Object.fromEntries(Object.entries(c.steps[i] ?? {}).filter(([, v]) => v)) }));

  return (
    <section aria-labelledby="lets-talk-heading" className="theme-light relative bg-light-surface py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
            <SectionTitle id="lets-talk-heading" className="max-w-[16ch] text-balance">
              {c.title}
            </SectionTitle>
          </Reveal>

          <ol className="mt-10">
            {steps.map((s, i) => {
              const Icon = ICONS[i] ?? Rocket;
              const last = i === steps.length - 1;
              return (
                <Reveal key={i} delay={80 + i * 90}>
                  <li className="relative flex gap-5 pb-8 last:pb-0">
                    {!last && <span aria-hidden className="absolute bottom-1 left-[21px] top-12 w-px bg-gradient-to-b from-[#0b0f19]/15 to-[#0b0f19]/[0.03]" />}
                    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#0b0f19]/[0.08] bg-white text-ink shadow-[0_1px_2px_rgba(11,15,25,0.05)]">
                      <Icon size={18} strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="pt-1.5">
                      <p className="font-urbanist text-[12px] font-semibold tabular-nums tracking-[0.12em] text-ink-faint">{String(i + 1).padStart(2, "0")}</p>
                      <h3 className="mt-1 font-urbanist text-[19px] font-bold leading-snug tracking-tight text-ink">{s.title}</h3>
                      <p className="mt-2 max-w-[48ch] font-urbanist text-[14.5px] leading-relaxed text-ink-dim">{s.body}</p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>

          <Reveal delay={360}>
            <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#0b0f19]/[0.08] bg-white px-4 py-2 font-urbanist text-[13px] text-ink-dim">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
              {c.note}
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-6 lg:pt-2">
          <BookingForm title={c.formTitle} text={c.formText} button={c.formButton} />
        </Reveal>
      </div>
    </section>
  );
}
