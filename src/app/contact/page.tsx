import type { Metadata } from "next";
import { mainMeta } from "@/lib/mainPages";
import SiteShell from "@/components/system/SiteShell";
import Reveal from "@/components/system/Reveal";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow } from "@/components/system/SectionHeading";
import ContactForm from "@/components/sections/ContactForm";
import HeroBackdrop from "@/components/system/HeroBackdrop";
import ContactChannels from "@/components/contact/ContactChannels";
import Offices from "@/components/contact/Offices";

export const metadata: Metadata = mainMeta("contact", {
  title: "Contact — Book a Call",
  description:
    "Tell CodeShaper about your product, timeline, and scope. We'll recommend the right service and engagement model and get back to you within one business day.",
  alternates: { canonical: "/contact" },
});

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
      <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
      <section className="page-hero theme-light relative isolate overflow-hidden rounded-b-[28px] sm:rounded-b-[32px] bg-canvas pb-16 pt-32 lg:pb-24 lg:pt-36" aria-labelledby="cta-heading">
        <HeroBackdrop />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
            <Reveal>
              <SectionEyebrow>Contact</SectionEyebrow>
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
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#0b0f19]/[0.1] bg-white font-urbanist text-xs font-semibold text-ink shadow-[0_1px_2px_rgba(11,15,25,0.05)]">
                        {s.n}
                      </span>
                      <span className="font-urbanist text-sm leading-relaxed text-ink-dim">{s.text}</span>
                    </span>
                    {i < NEXT_STEPS.length - 1 && (
                      <span className="connector-line mt-3 ml-3.5 block h-px w-10 bg-[#0b0f19]/[0.1]" aria-hidden />
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
      </div>
      {/* owner, 24 Nov 2026: every direct way in, then where we are */}
      <ContactChannels />
      <Offices />
    </SiteShell>
  );
}
