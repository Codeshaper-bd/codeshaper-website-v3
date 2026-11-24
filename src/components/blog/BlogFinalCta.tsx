import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MessagesSquare, Route } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { callPeople, whoLabel, CALL_MINUTES, type Founder } from "@/lib/founders";

/**
 * Closes every blog page: the free founder call (owner, 24 Nov 2026).
 *
 * The pattern premium product and agency sites use for a high-intent ask:
 * a contained card (the gradient stays inside the container, the page
 * background around it), copy on the left, a real portrait on the right.
 * One clear promise (free, 30 minutes, one to one), what the visitor leaves
 * with, one primary button, and a real reassurance line. Who appears is set
 * in CMS › Pages › Blog › Founder call (both founders by default, or one).
 * Background (owner, 24 Nov 2026): a full-width WHITE floating card, no
 * gradient; the content and its styles stay exactly as designed.
 */

const OUTCOMES = [
  { icon: MessagesSquare, title: "Straight answers", text: "Scope, timeline and budget, said plainly." },
  { icon: Compass, title: "The right model", text: "Which way of working fits your stage." },
  { icon: Route, title: "A clear next step", text: "Leave with a plan you can act on." },
];

/** A gentle idle float (globals.css badge-float, off for reduced motion); `phase` puts the two cards out of step. */
const float = (phase: number) => ({ animationDuration: "6s", animationDelay: `${-phase * 3}s` });

function Portrait({ person, quote, tall }: { person: Founder; quote?: string; tall: boolean }) {
  // two founders side by side: the name sits under the photo, so it never covers a face
  if (!tall) {
    return (
      <figure className="rounded-[24px] bg-white/55 p-2 shadow-[0_30px_60px_-34px_rgba(79,70,229,0.6)] ring-1 ring-white/80 backdrop-blur-sm">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#e6e5ea]">
          <Image src={person.photo} alt={person.name} fill quality={90} sizes="(min-width: 1024px) 240px, 45vw" className="object-cover object-[52%_30%]" />
        </div>
        <figcaption className="px-2.5 pb-1.5 pt-3">
          <p className="font-urbanist text-[15px] font-bold leading-tight text-ink">{person.name}</p>
          <p className="mt-0.5 font-urbanist text-[12.5px] font-medium text-ink-dim">{person.title}</p>
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="rounded-[26px] bg-white/45 p-2 shadow-[0_30px_60px_-34px_rgba(79,70,229,0.6)] ring-1 ring-white/80 backdrop-blur-sm">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#e6e5ea]">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          quality={90}
          sizes="(min-width: 1024px) 420px, 90vw"
          className="object-cover object-[52%_30%]"
        />
        {/* the name plate: frosted glass over the bottom of the photo */}
        <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-[16px] bg-white/80 px-4 py-3 shadow-[0_8px_24px_-12px_rgba(11,15,25,0.35)] ring-1 ring-white/70 backdrop-blur-md">
          <p className="font-urbanist text-[15.5px] font-bold leading-tight text-ink">{person.name}</p>
          <p className="mt-0.5 font-urbanist text-[12.5px] font-medium text-ink-dim">{person.title}, CodeShaper</p>
          {quote && <p className="mt-2 border-t border-[#0b0f19]/[0.07] pt-2 font-urbanist text-[13px] italic text-ink-mid">“{quote}”</p>}
        </figcaption>
      </div>
    </figure>
  );
}

export default function BlogFinalCta() {
  const people = callPeople();
  const solo = people.length === 1;

  return (
    // background only (owner, 24 Nov 2026): a full-width white floating card; the content inside is unchanged
    <div className="bg-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
    <section aria-labelledby="founder-call" className="theme-light relative overflow-hidden rounded-[28px] bg-canvas py-6 sm:rounded-[32px] lg:py-10">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="relative">
            <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-urbanist text-[12.5px] font-semibold text-ink">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 shadow-[0_2px_8px_-3px_rgba(11,15,25,0.2)] ring-1 ring-white/80">
                    <span aria-hidden className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Free {CALL_MINUTES}-minute call
                  </span>
                  <span className="text-ink-dim">One to one · No obligation</span>
                </div>

                <h2 id="founder-call" className="mt-6 max-w-[15ch] text-balance font-urbanist text-[40px] font-bold leading-[1.04] tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[58px]">
                  Talk it through with {whoLabel(people)}.
                  <span className="block text-[#0b0f19]/40">Not a sales team.</span>
                </h2>
                <p className="mt-6 max-w-xl font-urbanist text-[17px] leading-relaxed text-ink-mid">
                  Bring your idea, your deadline or the system that keeps you up at night. {CALL_MINUTES} minutes, and you know exactly where you stand.
                </p>

                <ul className="mt-9 grid gap-px overflow-hidden rounded-[20px] bg-white/50 ring-1 ring-white/70 sm:grid-cols-3">
                  {OUTCOMES.map((o) => (
                    // phones: one compact row each (icon left); from sm: three tiles
                    <li key={o.title} className="flex items-start gap-3.5 bg-white/45 p-4 backdrop-blur-sm sm:block sm:p-5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-white text-[#4f46e5] shadow-[0_2px_6px_-2px_rgba(11,15,25,0.18)]">
                        <o.icon size={17} strokeWidth={1.9} aria-hidden />
                      </span>
                      <div>
                        <p className="font-urbanist text-[14.5px] font-bold text-ink sm:mt-3">{o.title}</p>
                        <p className="mt-1 font-urbanist text-[13px] leading-snug text-ink-mid">{o.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#0b0f19] py-4 pl-7 pr-6 font-urbanist text-[15px] font-semibold text-white shadow-[0_16px_32px_-14px_rgba(11,15,25,0.75)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#1f2433]"
                  >
                    Book your free call
                    <ArrowRight size={16} strokeWidth={2} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <p className="font-urbanist text-[13.5px] text-ink-dim">We reply within one business day.</p>
                </div>
              </div>

              <div className="lg:col-span-5">
                {solo ? (
                  <div className="mx-auto max-w-[400px] lg:mr-0">
                    <div className="badge-float" style={float(0)}>
                      <Portrait person={people[0]} quote="You'll talk to me directly." tall />
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto grid max-w-[500px] grid-cols-2 gap-3 sm:gap-4 lg:mr-0">
                    {people.map((p, i) => (
                      <div key={p.photo} className={i === 1 ? "mt-8 sm:mt-14" : ""}>
                        <div className="badge-float" style={float(i)}>
                          <Portrait person={p} tall={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
    </div>
  );
}
