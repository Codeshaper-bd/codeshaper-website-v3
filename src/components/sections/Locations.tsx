import Reveal from "@/components/system/Reveal";

/**
 * 4.9 Locations — PASS 2: horizon glow pulses (~10s CSS), cards reveal
 * staggered with upward float, each card's dot pulses gently with staggered
 * phases, hover brightens glass + city name → Amber (CSS .loc-card).
 * (Earth loop video in Pass 3. No WebGL globe.)
 * Cities are PLACEHOLDERS — user must supply real offices.
 */
const CITIES = [
  { city: "[City 1]", lines: ["Street address — TBD", "Postcode, Country — TBD"] },
  { city: "[City 2]", lines: ["Street address — TBD", "Postcode, Country — TBD"] },
  { city: "[City 3]", lines: ["Street address — TBD", "Postcode, Country — TBD"] },
  { city: "[City 4]", lines: ["Street address — TBD", "Postcode, Country — TBD"] },
  { city: "[City 5]", lines: ["Street address — TBD", "Postcode, Country — TBD"] },
];

export default function Locations() {
  return (
    <section
      id="locations"
      className="relative overflow-hidden bg-canvas py-16 lg:py-32"
      aria-labelledby="locations-heading"
    >
      {/* ── Earth-from-space composition (CSS/SVG, static) ── */}
      <div aria-hidden className="absolute inset-0">
        {/* deep space base + faint starfield */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #101024 0%, #0A0A0F 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40 max-lg:hidden"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.6) 50%, transparent 51%), radial-gradient(1px 1px at 34% 8%, rgba(255,255,255,0.4) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 58% 30%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 76% 14%, rgba(255,255,255,0.35) 50%, transparent 51%), radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.45) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 22% 45%, rgba(255,255,255,0.3) 50%, transparent 51%), radial-gradient(1px 1px at 47% 18%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 65% 50%, rgba(255,255,255,0.3) 50%, transparent 51%)",
          }}
        />
        {/* planet horizon arc — bottom of section; glow pulses ~10s */}
        <div
          className="horizon-pulse absolute left-1/2 top-full h-[130vw] w-[220vw] -translate-x-1/2 -translate-y-[16%] rounded-[50%] lg:-translate-y-[22%]"
          style={{
            background:
              "radial-gradient(closest-side, #14142c 0%, #101024 78%, #0A0A0F 100%)",
            boxShadow:
              "0 -2px 40px rgba(91,95,239,0.55), 0 -12px 90px rgba(139,95,224,0.4), 0 -30px 180px rgba(139,95,224,0.25), 0 -60px 280px rgba(242,166,90,0.12)",
          }}
        />
        {/* atmosphere glow line along the horizon */}
        <div
          className="absolute left-1/2 top-full h-[130vw] w-[220vw] -translate-x-1/2 -translate-y-[16%] rounded-[50%] lg:-translate-y-[22%]"
          style={{
            border: "1.5px solid transparent",
            borderTopColor: "rgba(139,95,224,0.7)",
            filter: "blur(1px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.25em] text-ink-faint">
          Locations
        </p>
        <h2
          id="locations-heading"
          className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Where we work from.
        </h2>
        <p className="mt-4 max-w-xl font-body text-lg leading-relaxed text-ink-dim">
          Global delivery with local presence — one accountable team across
          time zones.
        </p>

        {/* Location cards — glass, stack on mobile; staggered float-in */}
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CITIES.map((c, i) => (
            <li key={c.city}>
              <Reveal delay={i * 90} distance={32} className="h-full">
                <article className="glass loc-card h-full rounded-xl p-8">
                  <span className="mb-4 flex items-center gap-2">
                    <span
                      className="dot-pulse h-2 w-2 rounded-full bg-aurora-amber"
                      style={{
                        boxShadow: "0 0 10px rgba(242,166,90,0.9)",
                        animationDelay: `${i * 640}ms`,
                      }}
                      aria-hidden
                    />
                    <span className="loc-city font-display text-xl font-bold tracking-tight text-ink">
                      {c.city}
                    </span>
                  </span>
                  {c.lines.map((l) => (
                    <p key={l} className="font-body text-sm leading-relaxed text-ink-dim">
                      {l}
                    </p>
                  ))}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
