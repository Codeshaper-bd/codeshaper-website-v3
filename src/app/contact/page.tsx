import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import Reveal from "@/components/system/Reveal";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact CodeShaper — Book a Call",
  description:
    "Tell CodeShaper about your product, timeline, and scope. We'll recommend the right service and engagement model and get back to you within one business day.",
  alternates: { canonical: "/contact" },
};

const NEXT_STEPS = [
  { n: "1", text: "Quick call — goals, constraints, honest fit check" },
  { n: "2", text: "Scope + plan — service, engagement model, timeline" },
  { n: "3", text: "Kickoff in ~1 week" },
];

/**
 * Real Contact page — this is the destination every "Book a Call" /
 * "Start a Project" CTA site-wide already points at. Content is the
 * same pitch the removed homepage FinalCtaForm used (real process
 * description, not invented claims), now living at its own real route
 * instead of a stub. See ContactForm.tsx / api/contact/route.ts for
 * the submission mechanics.
 */
export default function ContactPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-canvas py-16 lg:py-32" aria-labelledby="cta-heading">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
        <div
          aria-hidden
          className="absolute left-1/4 top-1/3 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.16), rgba(255,255,255,0.06), transparent)" }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pt-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:pt-32">
          <div>
            <Reveal>
              <p className="mb-3 font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
                Contact
              </p>
              <h1 id="cta-heading" className="font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Tell us your goal — we&apos;ll recommend the best path.
              </h1>
              <p className="mt-6 max-w-lg font-urbanist text-lg leading-relaxed text-ink-dim">
                Share timeline and scope, and we&apos;ll suggest the right service and engagement model.
              </p>

              <p className="mt-10 font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
                What happens next
              </p>
            </Reveal>
            <ol className="mt-4 space-y-4">
              {NEXT_STEPS.map((s, i) => (
                <li key={s.n}>
                  <Reveal delay={200 + i * 180}>
                    <span className="flex items-start gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-aurora-violet/50 font-urbanist text-xs font-medium text-ink">
                        {s.n}
                      </span>
                      <span className="font-urbanist text-sm leading-relaxed text-ink-dim">{s.text}</span>
                    </span>
                    {i < NEXT_STEPS.length - 1 && (
                      <span className="connector-line mt-3 ml-3.5 block h-px w-10 bg-aurora-violet/30" aria-hidden />
                    )}
                  </Reveal>
                </li>
              ))}
            </ol>

          </div>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
