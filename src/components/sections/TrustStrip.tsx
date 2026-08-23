import Reveal from "@/components/system/Reveal";

/**
 * Clients & trust — light theme (matches Hero/Navbar's `.theme-light` scope
 * rather than the page's default dark canvas, which is what made this band
 * look like a jarring black strip directly under the light Hero). Structure
 * borrows from the v2 site's "Selected Clients" section (eyebrow + heading +
 * copy, proof pills, a numbered "how we earn trust" row). Real client names,
 * split across two counter-scrolling rows inside a bordered panel — no logo
 * artwork on file yet, so each name gets a monogram chip instead of a bare
 * word, closer to a real logo-wall than a plain marquee of text.
 */
const LOGOS_ROW_1 = [
  "Essentialist",
  "Fennec",
  "Q Hotel Dhaka",
  "Microsoft",
  "Elite Capital Group",
  "Webflow",
  "Fiverr",
  "UpWork",
];
const LOGOS_ROW_2 = [
  "Lexa Shield",
  "Quinta dos Vales",
  "DTech Corporation Limited",
  "Astrica Trading",
  "MYTH LIFESTYLE",
  "GoPosly",
  "Framer",
  "Regray Stone",
];

const PROOF = ["Clear scope before estimates", "Weekly demos and decision notes", "Clean ownership transfer"];

const ASSURANCE = [
  { n: "01", title: "Weekly visibility", desc: "Progress, blockers, and decisions stay clear." },
  { n: "02", title: "Clean handover", desc: "Code, CMS, integrations, and access are organized." },
  { n: "03", title: "Flexible models", desc: "Project delivery, dedicated teams, and support." },
];

function MarqueeRow({ names, reverse = false }: { names: string[]; reverse?: boolean }) {
  const row = [...names, ...names]; // duplicated for seamless wrap
  return (
    <div
      className="marquee-track flex w-max items-center gap-4"
      style={reverse ? { animationDirection: "reverse" } : undefined}
    >
      {row.map((name, i) => (
        <span
          key={`${name}-${i}`}
          className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-urbanist text-[15px] font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 font-urbanist text-[11px] font-bold text-white">
            {name.charAt(0)}
          </span>
          {name}
        </span>
      ))}
    </div>
  );
}

export default function TrustStrip() {
  const allNames = [...LOGOS_ROW_1, ...LOGOS_ROW_2];

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
              <h2 className="max-w-xl font-urbanist text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
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

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal delay={160}>
          <div className="mega-feature-card relative mt-14 overflow-hidden rounded-[28px] p-8 sm:p-10 lg:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 text-white opacity-[0.05]"
              style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
            />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <p className="font-urbanist text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/50">
                Brands we&apos;ve shipped for
              </p>
              <p className="font-urbanist text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                {allNames.length}
                <span className="ml-2 align-middle font-urbanist text-[13px] font-medium normal-case tracking-normal text-white/50">
                  brands and counting
                </span>
              </p>
            </div>
            <div
              className="relative mt-9 -mx-8 space-y-4 overflow-hidden sm:-mx-10 lg:-mx-12"
              data-cursor="drag"
              aria-hidden
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              }}
            >
              <MarqueeRow names={LOGOS_ROW_1} />
              <MarqueeRow names={LOGOS_ROW_2} reverse />
            </div>
          </div>
        </Reveal>
        <span className="sr-only">Trusted by {allNames.join(", ")}</span>

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
