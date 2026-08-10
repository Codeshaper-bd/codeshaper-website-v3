import Reveal from "@/components/system/Reveal";

/**
 * 4.2 Trust strip — PASS 2: logo row becomes an infinite marquee
 * (~30s/loop, duplicated content for seamless wrap, pause on hover,
 * disabled under reduced motion via CSS). Proof pills stagger in.
 * PLACEHOLDER logos.
 */
const LOGOS = ["Northwind", "Acme Corp", "Globex", "Initech", "Umbra Labs", "Vertex Co", "Halcyon", "Structura"];

const PILLS = [
  "Weekly demos + shared visibility",
  "Clean handover: docs + source files",
  "Flexible engagement: Sprint, End-to-End, Team",
];

export default function TrustStrip() {
  const row = [...LOGOS, ...LOGOS]; // duplicated for seamless wrap
  return (
    <section aria-label="Clients and partners" className="border-y border-hairline bg-canvas py-16">
      <Reveal>
        <p className="mb-8 text-center font-body text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
          Trusted by teams building modern products
        </p>
      </Reveal>
      <div className="overflow-hidden" data-cursor="drag" aria-hidden>
        <div className="marquee-track flex w-max items-center gap-16 px-8">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-lg font-medium text-ink-faint transition-colors duration-300 hover:text-ink"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <span className="sr-only">Trusted by {LOGOS.join(", ")}</span>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {PILLS.map((p, i) => (
            <li key={p}>
              <Reveal delay={i * 80}>
                <span className="inline-block rounded-full border border-hairline px-4 py-2 font-body text-[13px] text-ink-dim">
                  {p}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
