import Link from "next/link";
import { FileText } from "lucide-react";
import { SERVICE_COLUMNS, SIMPLE_MENUS, INDUSTRIES, ENGAGEMENT_MODELS } from "@/lib/navigation";

/**
 * Footer — round 2, inspired by musemind.agency / designmonks.co (a huge
 * wordmark as a closing graphic statement) and Vivasoft / JoulesLabs (a
 * "Company Profile" link near the brand block). 5-column link grid is
 * unchanged; three additions on top:
 *
 * 1. "Company Profile" — no PDF asset exists yet, so this points at the
 *    real /company/about route rather than a fabricated download link
 *    that would 404. Swap the href for a real PDF if one gets added.
 * 2. The giant "codeshaper" wordmark sits in its own row near the
 *    bottom, same casing as the real logo lockup above — a static
 *    graphic close, not an animated element, matching how the
 *    reference sites use it (a full stop, not something to interact
 *    with).
 * 3. "Contact" removed from the Company links row per explicit request
 *    — FinalCtaForm right above this footer already is the contact
 *    surface, so a second "Contact" link here was redundant.
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

const colHead = "mb-4 font-urbanist text-xs font-medium uppercase tracking-[0.2em] text-ink-faint";
const colLink = "link-underline font-urbanist text-sm text-ink-dim transition-colors hover:text-ink";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-canvas pb-10 pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
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

          {/* Services */}
          <div>
            <p className={colHead}>Services</p>
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
          <div>
            <p className={colHead}>Industries</p>
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
          <div>
            <p className={colHead}>How We Engage</p>
            <ul className="space-y-2.5">
              {ENGAGEMENT_MODELS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={colLink}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insights */}
          <div>
            <p className={colHead}>Insights</p>
            <ul className="space-y-2.5">
              {insights.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={colLink}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company row (Contact removed — FinalCtaForm above is the contact surface) */}
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline pt-8">
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
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="font-urbanist text-xs text-ink-faint transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/legal/terms" className="font-urbanist text-xs text-ink-faint transition-colors hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
