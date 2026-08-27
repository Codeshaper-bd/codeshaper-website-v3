import { TrendingUp, ClipboardCheck, MessageSquareQuote } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

const LEVELS = [
  {
    icon: TrendingUp,
    title: "Hard outcomes",
    desc: "Conversion uplift, time saved, time-to-market, performance gains — shown wherever a client has shared them.",
  },
  {
    icon: ClipboardCheck,
    title: "Operational proof",
    desc: "Weekly demos, release cadence, clean handover, and documentation — true of every engagement, whether or not the numbers are public.",
  },
  {
    icon: MessageSquareQuote,
    title: "Qualitative proof",
    desc: "Testimonials, stakeholder feedback, and product usability wins from the people who actually used what we built.",
  },
];

export default function ProofLevels() {
  return (
    <section className="relative overflow-hidden bg-light-surface py-14 lg:py-20" aria-labelledby="proof-heading">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow>Proof, honestly</SectionEyebrow>
          <SectionTitle id="proof-heading">Proof you can trust — even when metrics vary</SectionTitle>
          <SectionDescription className="mt-3 max-w-xl">
            Not every client shares revenue numbers, so we show proof in three ways instead of padding a page with
            invented stats.
          </SectionDescription>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {LEVELS.map((l, i) => (
            <Reveal key={l.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-hairline-light text-aurora-violet">
                  <l.icon size={19} strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-urbanist text-[17px] font-bold text-ink">{l.title}</h3>
                <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{l.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
