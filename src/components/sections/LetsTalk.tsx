import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, PhoneCall, Rocket } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";

/**
 * Homepage › Let's talk. The page's closing move: what working with us
 * looks like in three steps, then one clear button. A dark card on the
 * site's floating-card frame, so it reads as the finale and doesn't blur
 * into the light footer below. The photo is the real team, not stock.
 * Step 3 repeats only what the Engagement models table already promises
 * for every model (start in 3–10 days, weekly demos, shared backlog, one
 * point of contact). The words come from the CMS (Pages › Home).
 */
const ICONS = [PhoneCall, Compass, Rocket];

export default function LetsTalk({ copy }: { copy?: CopyOf<"letsTalk"> }) {
  const c = homeCopy("letsTalk", copy);
  const base = homeCopy("letsTalk").steps;
  const steps = base.map((s, i) => ({ ...s, ...Object.fromEntries(Object.entries(c.steps[i] ?? {}).filter(([, v]) => v)) }));

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section aria-labelledby="lets-talk-heading" className="relative overflow-hidden rounded-[32px] bg-canvas py-16 font-urbanist lg:py-24">
        {/* soft aurora light, top right and bottom left */}
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-aurora-violet/20 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-40 h-[460px] w-[460px] rounded-full bg-aurora-indigo/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
          {/* the team */}
          <Reveal className="lg:col-span-6">
            <figure className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/media/studio/team-hoodies.webp"
                  alt="The CodeShaper team in matching hoodies at the studio"
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover"
                />
              </div>
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-auto">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span>
                  <span className="block text-[13.5px] font-semibold leading-tight text-white">{c.photoCaption}</span>
                  <span className="mt-0.5 block text-[12px] leading-tight text-white/65">{c.photoPlace}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* three steps and the button */}
          <div className="lg:col-span-6">
            <Reveal>
              <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
              <SectionTitle id="lets-talk-heading" className="max-w-[16ch] text-balance">
                {c.title}
              </SectionTitle>
            </Reveal>

            <ol className="mt-10 space-y-0">
              {steps.map((s, i) => {
                const Icon = ICONS[i] ?? Rocket;
                const last = i === steps.length - 1;
                return (
                  <Reveal key={i} delay={80 + i * 90}>
                    <li className="relative flex gap-5 pb-8 last:pb-0">
                      {!last && (
                        <span aria-hidden className="absolute left-[21px] top-12 bottom-1 w-px bg-gradient-to-b from-white/25 to-white/5" />
                      )}
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white shadow-[0_0_0_6px_rgba(255,255,255,0.02)]">
                        <Icon size={18} strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="pt-1.5">
                        <p className="text-[12px] font-semibold tabular-nums tracking-[0.12em] text-ink-faint">{String(i + 1).padStart(2, "0")}</p>
                        <h3 className="mt-1 text-[19px] font-bold leading-snug tracking-tight text-ink">{s.title}</h3>
                        <p className="mt-2 max-w-[52ch] text-[14.5px] leading-relaxed text-ink-dim">{s.body}</p>
                      </div>
                    </li>
                  </Reveal>
                );
              })}
            </ol>

            <Reveal delay={360}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/contact"
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#0b0f19] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_14px_40px_-12px_rgba(167,139,250,0.55)]"
                >
                  {c.button}
                  <ArrowRight size={15} strokeWidth={1.9} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <p className="text-[13px] text-ink-dim">{c.note}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
