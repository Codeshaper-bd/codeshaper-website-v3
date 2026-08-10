import Link from "next/link";
import Reveal from "@/components/system/Reveal";

/**
 * 4.6 Success stories — PASS 2: cards reveal staggered; hover lifts -4px,
 * shadow deepens (card-light + lift-md), cover gradient subtly shifts
 * (inner scale), title arrow slides in. Static 3-card grid (draggable
 * carousel only if more cards are added later). Content unchanged;
 * no numeric metrics in current copy, so no count-ups apply here.
 */
type Story = {
  outcome: string;
  industry: string;
  services: string;
  model: string;
  image: string;
  video: string;
  gradient: string;
};

const STORIES: Story[] = [
  {
    outcome: "MVP shipped in 8–12 weeks with weekly demos",
    industry: "SaaS",
    services: "Design · Engineering",
    model: "MVP Sprint",
    image: "/media/case-fintech.jpg",
    video: "/media/case-fintech.webm",
    gradient: "linear-gradient(135deg, #232350 0%, #35307c 55%, #4a3a8e 100%)",
  },
  {
    outcome: "Replatformed checkout + improved performance",
    industry: "eCommerce",
    services: "Commerce · Engineering",
    model: "End-to-End",
    image: "/media/case-commerce.jpg",
    video: "/media/case-commerce.webm",
    gradient: "linear-gradient(135deg, #3a2340 0%, #63395e 55%, #96604a 100%)",
  },
  {
    outcome: "Automated internal workflow, reduced manual ops",
    industry: "Logistics",
    services: "AI & Automation",
    model: "AI / Automation",
    image: "/media/case-logistics.jpg",
    video: "/media/case-logistics.webm",
    gradient: "linear-gradient(135deg, #1c1c46 0%, #2b3a72 55%, #3d5290 100%)",
  },
];

const Hex = () => (
  <svg width="40" height="44" viewBox="0 0 26 28" aria-hidden>
    <path
      d="M13 1 L24.3 7.5 L24.3 20.5 L13 27 L1.7 20.5 L1.7 7.5 Z"
      fill="none"
      stroke="rgba(245,244,242,0.5)"
      strokeWidth="1.4"
    />
  </svg>
);

export default function CaseStudies() {
  return (
    <section className="bg-light-surface py-16 lg:py-32" aria-labelledby="work-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.25em] text-light-dim">
              Proof
            </p>
            <h2
              id="work-heading"
              className="font-display text-3xl font-bold tracking-tight text-light-ink sm:text-4xl"
            >
              Work that shipped, numbers that stuck.
            </h2>
          </div>
          <Link
            href="/work"
            className="font-body text-sm font-medium text-light-dim underline-offset-4 hover:text-light-ink hover:underline"
          >
            View all Success Stories →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {STORIES.map((s, i) => (
            <Reveal key={s.outcome} delay={i * 90} className="h-full">
              <article className="card-light lift-md group h-full overflow-hidden rounded-xl">
                {/* Generated cover still + hover video; gradient+hex is the
                    always-present base layer, so a missing file can never
                    render as an empty block. */}
                <div className="relative aspect-[16/10] overflow-hidden" aria-hidden>
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    style={{ background: s.gradient }}
                  >
                    <Hex />
                    <span className="font-display text-xs font-medium uppercase tracking-[0.25em] text-white/60">
                      {s.industry}
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  {/* autoPlay+muted keeps this a server component (no event
                      handlers); it only becomes visible on card hover */}
                  <video
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    src={s.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="font-display text-xl font-bold leading-snug text-light-ink">
                    {s.outcome}
                    <span
                      className="ml-2 inline-block -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    >
                      →
                    </span>
                  </h3>
                  <p className="mt-3 font-body text-sm text-light-dim">{s.services}</p>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline-light pt-4">
                    <span className="rounded-full border border-black/10 px-3 py-1 font-body text-xs text-light-dim">
                      {s.industry}
                    </span>
                    <span className="rounded-full border border-black/10 bg-aurora-violet/10 px-3 py-1 font-body text-xs text-light-ink">
                      {s.model}
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
