import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * Same outer frame as BlogHero/BlogBrowser (bg-light-surface p-3 sm:p-4,
 * no max-width cap) so all three cards read as one consistent set —
 * full-bleed-minus-margin, same rounded corners. The card itself
 * deliberately breaks from the page's light theme for one high-contrast
 * closing moment: reuses the same dark gradient (`.mega-feature-card`,
 * defined in globals.css) already used for the nav's "Featured" card,
 * plus a soft radial glow (same technique as Hero/ContactForm's ambient
 * highlight) layered on top for more depth. Text is explicit white/
 * white-alpha classes, not the theme-token components (SectionEyebrow
 * etc. resolve to *light*-theme dark text here, which would be
 * unreadable on this card).
 */
export default function BlogFinalCta() {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <Reveal>
        <div className="mega-feature-card relative overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-12 lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.25), transparent)" }}
          />
          <div className="relative">
            <p className="mb-4 font-urbanist text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
              Next step
            </p>
            <h2 className="mx-auto max-w-2xl font-urbanist text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Have a project goal? We&apos;ll help you choose the best path.
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-urbanist text-[15px] leading-relaxed text-white/70">
              Tell us your timeline and scope — we&apos;ll recommend the right starting model.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-urbanist text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.02]"
              >
                Book a Call
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-colors hover:border-white/50"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
