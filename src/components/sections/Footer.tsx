import type { CSSProperties } from "react";
import Link from "next/link";
import { FileText, ArrowUp, Mail, Phone } from "lucide-react";
import { SERVICE_COLUMNS, SIMPLE_MENUS, INDUSTRIES_POPULAR, ENGAGEMENT_MODELS } from "@/lib/navigation";
import FooterWordmark from "./FooterWordmark";

/**
 * Footer — round 6. Correction on round 5's "partner logos": the user
 * clarified they weren't asking for tech/tool partnerships (which is
 * why round 5 used invented placeholder marks — nothing like that was
 * confirmed real) but for review-platform badges — Codeshaper has real
 * reviews on Google, Clutch, Upwork, and Fiverr. That's a confirmed
 * fact from the user, not a placeholder situation, so REVIEW_PLATFORMS
 * replaces PARTNER_LOGOS entirely and moves to right under the social
 * row per explicit request.
 *
 * Each badge is a bold wordmark in that platform's real brand color
 * (Google's four-color letter pattern is its actual real color scheme,
 * not a guess) rather than a hand-drawn logo mark — safer than
 * approximating a trademarked icon by hand, and still immediately
 * recognizable. What's still NOT included: a star rating or review
 * count. The platforms are confirmed real; the actual scores aren't
 * known here, and a specific number (stars, review count) is exactly
 * the kind of fact this project doesn't invent. Add the real numbers
 * (and swap href="#" for the real profile URLs) whenever available.
 *
 * Social row (top of footer, 44px badges) and the FooterWordmark
 * (caps, full-width via measured JS fit) are unchanged from round 5.
 * Even columns and "— TBD" contact placeholders unchanged from round 4.
 */
const CITY_NAMES = ["Bangladesh", "Japan", "USA", "UK", "Australia", "New Zealand"];

const insights = SIMPLE_MENUS.find((m) => m.id === "insights")!;
const insightsLinks = insights.links.filter((l) => l.label !== "Downloads");
const company = SIMPLE_MENUS.find((m) => m.id === "company")!;
const companyLinks = company.links.filter((l) => l.label !== "Contact");

/** Placeholder — no real social profiles exist yet for this project. */
const SOCIAL_LINKS: { label: string; href: string; d: string }[] = [
  { label: "LinkedIn", href: "#", d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" },
  { label: "X", href: "#", d: "M3 3h4.6l4 5.8L16.2 3H21l-6.9 8.9L21.4 21h-4.6l-4.4-6.3L6.6 21H2l7.3-9.3L3 3Z" },
  { label: "Instagram", href: "#", d: "M12 2.2c2.7 0 3 0 4.1.06 1.1.05 1.85.23 2.5.48.68.27 1.26.63 1.83 1.2.57.57.93 1.15 1.2 1.83.25.65.43 1.4.48 2.5.06 1.1.06 1.4.06 4.1s0 3-.06 4.1c-.05 1.1-.23 1.85-.48 2.5a4.9 4.9 0 0 1-1.2 1.83 4.9 4.9 0 0 1-1.83 1.2c-.65.25-1.4.43-2.5.48-1.1.06-1.4.06-4.1.06s-3 0-4.1-.06c-1.1-.05-1.85-.23-2.5-.48a4.9 4.9 0 0 1-1.83-1.2 4.9 4.9 0 0 1-1.2-1.83c-.25-.65-.43-1.4-.48-2.5C2.2 15 2.2 14.7 2.2 12s0-3 .06-4.1c.05-1.1.23-1.85.48-2.5.27-.68.63-1.26 1.2-1.83a4.9 4.9 0 0 1 1.83-1.2c.65-.25 1.4-.43 2.5-.48C9 2.2 9.3 2.2 12 2.2Zm0 1.8c-2.65 0-2.97 0-4.02.06-.9.04-1.4.19-1.72.32-.43.17-.74.37-1.07.7-.33.33-.53.64-.7 1.07-.13.32-.28.82-.32 1.72C4.11 9 4.1 9.32 4.1 12s0 2.97.06 4.02c.04.9.19 1.4.32 1.72.17.43.37.74.7 1.07.33.33.64.53 1.07.7.32.13.82.28 1.72.32 1.05.06 1.37.06 4.03.06s2.97 0 4.02-.06c.9-.04 1.4-.19 1.72-.32.43-.17.74-.37 1.07-.7.33-.33.53-.64.7-1.07.13-.32.28-.82.32-1.72.06-1.05.06-1.37.06-4.02s0-2.97-.06-4.02c-.04-.9-.19-1.4-.32-1.72a2.9 2.9 0 0 0-.7-1.07 2.9 2.9 0 0 0-1.07-.7c-.32-.13-.82-.28-1.72-.32C14.97 4 14.65 4 12 4Zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.8-3.35a1.08 1.08 0 1 1 0 2.15 1.08 1.08 0 0 1 0-2.15Z" },
  { label: "YouTube", href: "#", d: "M21.6 7.2s-.2-1.5-.85-2.15c-.8-.85-1.7-.85-2.1-.9C15.9 4 12 4 12 4h-.03s-3.9 0-6.65.15c-.4.05-1.3.05-2.1.9-.65.65-.85 2.15-.85 2.15S2.15 9 2.15 10.8v1.6c0 1.8.22 3.6.22 3.6s.2 1.5.85 2.15c.8.85 1.85.82 2.32.91C7.05 19.2 12 19.25 12 19.25s3.9 0 6.65-.15c.4-.05 1.3-.05 2.1-.9.65-.65.85-2.15.85-2.15s.22-1.8.22-3.6v-1.6c0-1.8-.22-3.6-.22-3.6ZM9.95 14.4V8.8l5.4 2.8-5.4 2.8Z" },
];

/**
 * Real platforms (confirmed by the user), scores/counts not known —
 * see file header. href="#" pending the real profile URLs.
 */
const REVIEW_PLATFORMS = [
  { name: "Google", href: "#", colors: ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"] },
  { name: "Clutch", href: "#", color: "#EF2D45" },
  { name: "Upwork", href: "#", color: "#14A800" },
  { name: "Fiverr", href: "#", color: "#1DBF73" },
] as const;

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
        {/* Social row — top of the footer, large standout badges */}
        <div className="flex flex-col gap-5 border-b border-hairline pb-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
            Follow Codeshaper
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink-dim transition-[border-color,color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-aurora-violet/60 hover:bg-aurora-violet/10 hover:text-ink"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Reviews — real platforms, scores/counts not known, see file header */}
        <div className="mt-8 border-b border-hairline pb-8">
          <p className="mb-5 font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
            Reviewed On
          </p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            {REVIEW_PLATFORMS.map((p) => {
              const accent = "colors" in p ? p.colors[0] : p.color;
              return (
                <a
                  key={p.name}
                  href={p.href}
                  className="flex items-center justify-center rounded-2xl border border-hairline px-7 py-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--glow-border)] hover:shadow-[0_12px_30px_var(--glow-shadow)]"
                  style={
                    {
                      "--glow-border": `${accent}66`,
                      "--glow-shadow": `${accent}26`,
                    } as CSSProperties
                  }
                >
                  {"colors" in p ? (
                    <span className="font-urbanist text-2xl font-bold tracking-tight sm:text-3xl">
                      {p.name.split("").map((ch, i) => (
                        <span key={i} style={{ color: p.colors[i] }}>{ch}</span>
                      ))}
                    </span>
                  ) : (
                    <span className="font-urbanist text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: p.color }}>
                      {p.name}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-8">
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

            {/* Contact — placeholders, see file header. */}
            <div className="mt-7 space-y-2">
              <p className="flex items-center gap-2 font-urbanist text-[13px] text-ink-faint">
                <Mail size={13} strokeWidth={1.75} className="shrink-0" />
                Email — TBD
              </p>
              <p className="flex items-center gap-2 font-urbanist text-[13px] text-ink-faint">
                <Phone size={13} strokeWidth={1.75} className="shrink-0" />
                Phone — TBD
              </p>
            </div>
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
                  {INDUSTRIES_POPULAR.map((l) => (
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
                  <li>
                    <Link href="/how-we-work/engagement" className={colLink}>All engagement models →</Link>
                  </li>
                </ul>
              </div>

              {/* Insights */}
              <div className="p-6 sm:p-7">
                <ColHead>Insights</ColHead>
                <ul className="space-y-2.5">
                  {insightsLinks.map((l) => (
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

        {/* Giant wordmark — GSAP stagger reveal + magnetic hover, see FooterWordmark.tsx */}
        <div className="mt-14 overflow-hidden border-t border-hairline pt-8">
          <FooterWordmark />
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
