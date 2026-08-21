import MagneticButton from "@/components/system/MagneticButton";

/**
 * Final CTA — dark canvas returns. One restrained glow behind the CTA
 * only; everything else flat and quiet.
 */
export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-canvas py-24 lg:py-40" aria-labelledby="cta-heading">
      {/* hex line-pattern texture (Phase 1 asset), very faint */}
      <div
        aria-hidden
        className="absolute inset-0 text-white opacity-[0.04]"
        style={{
          backgroundImage: "url(/media/hex-pattern-tile.svg)",
          backgroundSize: "112px 194px",
        }}
      />
      {/* single restrained glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.5), rgba(67,56,202,0.2), transparent)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 id="cta-heading" className="font-urbanist text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Let&apos;s shape your next product.
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-urbanist text-lg leading-relaxed text-ink-dim">
          A 30-minute call: your goals, our honest read on scope, and a
          kickoff date — usually within a week.
        </p>
        <div className="mt-10">
          <MagneticButton href="/contact" glow>
            Book a Call <span aria-hidden>→</span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
