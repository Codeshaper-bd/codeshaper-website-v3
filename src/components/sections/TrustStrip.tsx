import Reveal from "@/components/system/Reveal";

/**
 * Clients & trust — light theme (matches Hero/Navbar's `.theme-light` scope
 * rather than the page's default dark canvas, which is what made this band
 * look like a jarring black strip directly under the light Hero). Structure
 * borrows from the v2 site's "Selected Clients" section (eyebrow + heading +
 * copy, proof pills, a numbered "how we earn trust" row) with the logo
 * marquee kept from Pass 2 since real client logos aren't available yet.
 * PLACEHOLDER logos.
 */
const LOGOS = ["Northwind", "Acme Corp", "Globex", "Initech", "Umbra Labs", "Vertex Co", "Halcyon", "Structura"];

const PROOF = ["Clear scope before estimates", "Weekly demos and decision notes", "Clean ownership transfer"];

const ASSURANCE = [
  { n: "01", title: "Weekly visibility", desc: "Progress, blockers, and decisions stay clear." },
  { n: "02", title: "Clean handover", desc: "Code, CMS, integrations, and access are organized." },
  { n: "03", title: "Flexible models", desc: "Project delivery, dedicated teams, and support." },
];

export default function TrustStrip() {
  const row = [...LOGOS, ...LOGOS]; // duplicated for seamless wrap

  return (
    <section
      aria-label="Clients and partners"
      className="theme-light border-y border-hairline bg-canvas py-20 font-urbanist lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-hairline px-4 py-1.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
                Selected Clients
              </p>
              <h2 className="max-w-xl font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Built to earn trust at every handover.
              </h2>
            </div>
            <p className="max-w-sm font-urbanist text-base leading-relaxed text-ink-dim">
              Founders, SaaS teams, and service businesses that need clear scope, senior delivery, and clean ownership
              at launch.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ul className="mt-8 flex flex-wrap gap-3">
            {PROOF.map((p) => (
              <li
                key={p}
                className="rounded-full border border-hairline bg-canvas-raised px-4 py-2 font-urbanist text-[13px] text-ink-dim"
              >
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={160}>
        <div
          className="relative mt-14 overflow-hidden"
          data-cursor="drag"
          aria-hidden
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="marquee-track flex w-max items-center gap-16 px-8">
            {row.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="whitespace-nowrap font-urbanist text-lg font-semibold text-ink-faint transition-colors duration-300 hover:text-ink"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
      <span className="sr-only">Trusted by {LOGOS.join(", ")}</span>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mt-16 grid gap-10 border-t border-hairline pt-12 sm:grid-cols-3">
          {ASSURANCE.map((a, i) => (
            <Reveal key={a.n} delay={i * 80}>
              <div className="flex items-start gap-4">
                <span className="mega-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-urbanist text-[13px] font-bold text-aurora-violet">
                  {a.n}
                </span>
                <div>
                  <p className="font-urbanist text-base font-semibold text-ink">{a.title}</p>
                  <p className="mt-1 font-urbanist text-sm leading-relaxed text-ink-dim">{a.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
