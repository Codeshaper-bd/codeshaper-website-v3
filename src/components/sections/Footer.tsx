import Link from "next/link";
import { FileText, ArrowUp } from "lucide-react";
import { SERVICE_COLUMNS, SIMPLE_MENUS, INDUSTRIES, ENGAGEMENT_MODELS } from "@/lib/navigation";

/**
 * Footer — round 3. Feedback: the link columns read as "very basic" —
 * plain floating text on flat black, no structure — next to designmonks.co,
 * which groups its links inside bordered/textured panels rather than
 * leaving them loose.
 *
 * Kept the 5-column content (Brand + Services/Industries/How We
 * Engage/Insights) but regrouped the 4 link columns into one bordered,
 * divided panel (`divide-x` on desktop, `divide-y` stacked on mobile)
 * instead of four columns floating independently — the actual fix for
 * "basic," not just a coat of paint. Added a subtle violet ambient glow
 * behind the whole footer for depth (same restrained accent language as
 * every other dark section, not designmonks' literal green wash), small
 * accent-dot bullets on each column heading (matching the eyebrow-dot
 * convention used everywhere else on this site), and a "Back to top"
 * control near the legal bar — a plain `href="#"` anchor, no client JS
 * needed since an empty fragment already scrolls to the document top.
 *
 * The giant "codeshaper" wordmark stays as-is (round 2) — that wasn't
 * part of this round's complaint.
 *
 * FinalCtaForm (the homepage contact-form section that used to sit
 * directly above this footer) was removed per direct request; the
 * "Contact" entry was already dropped from the Company links row last
 * round for the same reason, so nothing else changes on that front.
 *
 * No social icons and no certification/award badges (ISO, GDPR, Clutch
 * rating, etc.) like the references show — none of those exist for this
 * project as verified fact, and inventing trust badges is exactly the
 * kind of fabricated claim this project avoids everywhere else.
 */
const CITY_NAMES = ["Bangladesh", "Japan", "USA", "UK", "Australia", "New Zealand"];

const insights = SIMPLE_MENUS.find((m) => m.id === "insights")!;
const company = SIMPLE_MENUS.find((m) => m.id === "company")!;
const companyLinks = company.links.filter((l) => l.label !== "Contact");

const colLink = "link-underline font-urbanist text-sm text-ink-dim transition-colors hover:text-ink";

function ColHead({ children }: { children: string }) {
  return (
    <p className="mb-4 flex items-center gap-2 font-urbanist text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
      <span className="h-1 w-1 shrink-0 rounded-full bg-aurora-amber" aria-hidden />
      {children}
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-canvas pb-10 pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 45% at 50% 0%, rgba(124,108,255,0.1), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="Codeshaper home">
              <svg width="22" height="24" viewBox="0 0 26 28" aria-hidden>
                <path
                  d="M13 1 L24.3 7.5 L24.3 20.5 L13 27 L1.7 20.5 L1.7 7.5 Z"
                  fill="none"
                  stroke="#8B5FE0"
                  strokeWidth="2"
                />
              </svg>
              <span className="font-urbanist text-lg font-bold tracking-tight text-ink">
                codeshaper
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-urbanist text-sm leading-relaxed text-ink-faint">
              Product design, web &amp; mobile engineering, commerce, and AI
              automation — with weekly visibility and clean handover.
            </p>
            <Link
              href="/company/about"
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-hairline px-4 py-2 font-urbanist text-xs font-medium text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
            >
              <FileText size={13} strokeWidth={1.75} />
              Company Profile
            </Link>
          </div>

          {/* Link panel — one bordered card, divided internally instead of four loose columns */}
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02]">
            <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              {/* Services */}
              <div className="p-6 sm:p-7">
                <ColHead>Services</ColHead>
                <ul className="space-y-2.5">
                  {SERVICE_COLUMNS.map((c) => (
                    <li key={c.id}>
                      <Link href={c.href} className={colLink}>{c.title}</Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/services" className={colLink}>All services →</Link>
                  </li>
                </ul>
              </div>

              {/* Industries */}
              <div className="p-6 sm:p-7">
                <ColHead>Industries</ColHead>
                <ul className="space-y-2.5">
                  {INDUSTRIES.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={colLink}>{l.label}</Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/industries" className={colLink}>All industries →</Link>
                  </li>
                </ul>
              </div>

              {/* How We Engage */}
              <div className="p-6 sm:p-7">
                <ColHead>How We Engage</ColHead>
                <ul className="space-y-2.5">
                  {ENGAGEMENT_MODELS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={colLink}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Insights */}
              <div className="p-6 sm:p-7">
                <ColHead>Insights</ColHead>
                <ul className="space-y-2.5">
                  {insights.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={colLink}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Company row */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline pt-8">
          {companyLinks.map((l) => (
            <Link key={l.href} href={l.href} className={colLink}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Cities row → Locations section */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {CITY_NAMES.map((c) => (
            <Link key={c} href="#locations" className="font-urbanist text-xs text-ink-faint transition-colors hover:text-ink">
              {c}
            </Link>
          ))}
        </div>

        {/* Giant wordmark — closing graphic statement, not interactive */}
        <div aria-hidden className="mt-14 overflow-hidden border-t border-hairline pt-8">
          <p className="select-none whitespace-nowrap font-urbanist text-[clamp(3rem,15vw,11rem)] font-black leading-[0.85] tracking-tighter text-ink">
            codeshaper
          </p>
        </div>

        {/* Legal bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <p className="font-urbanist text-xs text-ink-faint">
            © {new Date().getFullYear()} Codeshaper. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="font-urbanist text-xs text-ink-faint transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/legal/terms" className="font-urbanist text-xs text-ink-faint transition-colors hover:text-ink">
              Terms
            </Link>
            <a
              href="#"
              aria-label="Back to top"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-ink-faint transition-colors hover:border-ink-faint hover:text-ink"
            >
              <ArrowUp size={14} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
