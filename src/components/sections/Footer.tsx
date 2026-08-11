import Link from "next/link";
import { SERVICE_COLUMNS, SIMPLE_MENUS, INDUSTRIES, ENGAGEMENT_MODELS } from "@/lib/navigation";

/**
 * 4.11 Footer — DARK, flat, quiet. 5 aligned columns
 * (Brand / Services / Industries / How We Work / Insights),
 * company links row, city names row (links to #locations), legal bar.
 */
const CITY_NAMES = ["[City 1]", "[City 2]", "[City 3]", "[City 4]", "[City 5]"]; // PLACEHOLDER

const insights = SIMPLE_MENUS.find((m) => m.id === "insights")!;
const company = SIMPLE_MENUS.find((m) => m.id === "company")!;

const colHead = "mb-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-ink-faint";
const colLink = "font-body text-sm text-ink-dim transition-colors hover:text-ink";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas pb-10 pt-20">
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
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                codeshaper
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-ink-faint">
              Product design, web &amp; mobile engineering, commerce, and AI
              automation — with weekly visibility and clean handover.
            </p>
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

        {/* Company row */}
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline pt-8">
          {company.links.map((l) => (
            <Link key={l.href} href={l.href} className={colLink}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Cities row → Locations section */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {CITY_NAMES.map((c) => (
            <Link key={c} href="#locations" className="font-body text-xs text-ink-faint transition-colors hover:text-ink">
              {c}
            </Link>
          ))}
        </div>

        {/* Legal bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <p className="font-body text-xs text-ink-faint">
            © {new Date().getFullYear()} Codeshaper. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="font-body text-xs text-ink-faint transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/legal/terms" className="font-body text-xs text-ink-faint transition-colors hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
