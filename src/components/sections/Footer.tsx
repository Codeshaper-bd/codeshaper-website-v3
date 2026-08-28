import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, ArrowUp, Mail, Phone } from "lucide-react";
import { SERVICE_COLUMNS, SIMPLE_MENUS, INDUSTRIES_POPULAR, ENGAGEMENT_MODELS } from "@/lib/navigation";
import FooterWordmark from "./FooterWordmark";
import Reveal from "@/components/system/Reveal";

/**
 * Footer — round 8. Reviews and Partners & Memberships were two
 * separate labeled blocks (each with its own heading, border, and
 * vertical margin) — merged into one TRUST_BADGES row under a single
 * heading to compact the footer's height, per explicit request. Every
 * badge now carries a subtitle ("Reviews" added to the four platforms
 * that didn't have one before) so the row reads consistently without
 * needing separate group headers to tell reviews from partnerships
 * apart — the subtitle does that job inline.
 *
 * Badge padding tightened slightly (px-6/py-4, was px-7/py-5) since a
 * single row now holds 8 badges instead of two rows of 5 and 3.
 *
 * Content/colors are unchanged from round 7 — real platforms/partners/
 * membership the user confirmed, real brand colors where confident,
 * BASIS neutral rather than a guessed color, no invented star ratings
 * or review counts, href="#" pending real profile URLs.
 *
 * Round 9, direct feedback: dropped the flat "pure black" root-scope
 * surface for `theme-light` plus the sitewide floating-card frame
 * (`bg-light-surface p-3 sm:p-4` outer margin + `rounded-[32px]
 * bg-canvas` section) every other section already uses — the footer
 * was the last remaining pure-dark surface on the page. Most text
 * already used the theme-aware `ink`/`ink-dim`/`ink-faint` tokens so it
 * flipped for free; three things didn't and needed fixing by hand:
 *  - The link panel's border/bg/divide were hardcoded `white/opacity`
 *    values (assumed a dark backdrop) — now `border-hairline
 *    bg-light-surface divide-hairline`, the same recipe every other
 *    card-on-card panel on the site uses.
 *  - The "X" social icon's color was `#ffffff` — invisible once its
 *    circle badge (background/border also derived from that same
 *    white) sat on a light surface. Switched to `#0b0f19`, on-brand for
 *    either theme (X's mark is officially monochrome, just flipped).
 *  - The brand lockup used an icon-only badge + a manually reconstructed
 *    "codeShaper" text span, because the real raster wordmark
 *    (`/brand/logo.png`) bakes in a black wordmark that couldn't sit on
 *    the old dark surface. That workaround is gone — this section is
 *    light now, so it uses the same real logo Navbar does.
 *
 * The 4-column nav grid (Services / Industries / How We Engage / Blog)
 * had a real balance problem, not just a color one: Blog only ever has
 * one real link (Insights is disabled — see the filter above), so that
 * column sat almost empty against three siblings with 6 items each once
 * the shared `divide-x` grid stretched every column to the tallest
 * one's height. Blog's link moved into the company row below instead
 * (where a single extra link costs nothing), leaving three genuinely
 * comparable columns. Industries — 5 short one-word items — also got
 * its own internal 2-column sub-grid per direct request, both because
 * it reads denser/more considered than a plain vertical list and
 * because it shortens that column to match its siblings even better.
 */
const CITY_NAMES = ["Bangladesh", "Japan", "USA", "UK", "Australia", "New Zealand"];

// Insights is disabled for now (see its `enabled: false` in
// navigation.ts) — Blog is the only real page behind it, so it rides
// along in the company row below instead of anchoring its own
// dedicated nav column (see the file header for why).
const insights = SIMPLE_MENUS.find((m) => m.id === "insights")!;
const blogLink = insights.links.find((l) => l.label === "Blog")!;
const company = SIMPLE_MENUS.find((m) => m.id === "company")!;
const companyLinks = [...company.links.filter((l) => l.label !== "Contact"), blogLink];

/** Placeholder hrefs — no real social profile URLs exist yet for this project. */
const SOCIAL_LINKS: { label: string; href: string; color: string; d: string }[] = [
  { label: "LinkedIn", href: "#", color: "#0A66C2", d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" },
  { label: "X", href: "#", color: "#0b0f19", d: "M3 3h4.6l4 5.8L16.2 3H21l-6.9 8.9L21.4 21h-4.6l-4.4-6.3L6.6 21H2l7.3-9.3L3 3Z" },
  { label: "Instagram", href: "#", color: "#E1306C", d: "M12 2.2c2.7 0 3 0 4.1.06 1.1.05 1.85.23 2.5.48.68.27 1.26.63 1.83 1.2.57.57.93 1.15 1.2 1.83.25.65.43 1.4.48 2.5.06 1.1.06 1.4.06 4.1s0 3-.06 4.1c-.05 1.1-.23 1.85-.48 2.5a4.9 4.9 0 0 1-1.2 1.83 4.9 4.9 0 0 1-1.83 1.2c-.65.25-1.4.43-2.5.48-1.1.06-1.4.06-4.1.06s-3 0-4.1-.06c-1.1-.05-1.85-.23-2.5-.48a4.9 4.9 0 0 1-1.83-1.2 4.9 4.9 0 0 1-1.2-1.83c-.25-.65-.43-1.4-.48-2.5C2.2 15 2.2 14.7 2.2 12s0-3 .06-4.1c.05-1.1.23-1.85.48-2.5.27-.68.63-1.26 1.2-1.83a4.9 4.9 0 0 1 1.83-1.2c.65-.25 1.4-.43 2.5-.48C9 2.2 9.3 2.2 12 2.2Zm0 1.8c-2.65 0-2.97 0-4.02.06-.9.04-1.4.19-1.72.32-.43.17-.74.37-1.07.7-.33.33-.53.64-.7 1.07-.13.32-.28.82-.32 1.72C4.11 9 4.1 9.32 4.1 12s0 2.97.06 4.02c.04.9.19 1.4.32 1.72.17.43.37.74.7 1.07.33.33.64.53 1.07.7.32.13.82.28 1.72.32 1.05.06 1.37.06 4.03.06s2.97 0 4.02-.06c.9-.04 1.4-.19 1.72-.32.43-.17.74-.37 1.07-.7.33-.33.53-.64.7-1.07.13-.32.28-.82.32-1.72.06-1.05.06-1.37.06-4.02s0-2.97-.06-4.02c-.04-.9-.19-1.4-.32-1.72a2.9 2.9 0 0 0-.7-1.07 2.9 2.9 0 0 0-1.07-.7c-.32-.13-.82-.28-1.72-.32C14.97 4 14.65 4 12 4Zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.8-3.35a1.08 1.08 0 1 1 0 2.15 1.08 1.08 0 0 1 0-2.15Z" },
  { label: "YouTube", href: "#", color: "#FF0000", d: "M21.6 7.2s-.2-1.5-.85-2.15c-.8-.85-1.7-.85-2.1-.9C15.9 4 12 4 12 4h-.03s-3.9 0-6.65.15c-.4.05-1.3.05-2.1.9-.65.65-.85 2.15-.85 2.15S2.15 9 2.15 10.8v1.6c0 1.8.22 3.6.22 3.6s.2 1.5.85 2.15c.8.85 1.85.82 2.32.91C7.05 19.2 12 19.25 12 19.25s3.9 0 6.65-.15c.4-.05 1.3-.05 2.1-.9.65-.65.85-2.15.85-2.15s.22-1.8.22-3.6v-1.6c0-1.8-.22-3.6-.22-3.6ZM9.95 14.4V8.8l5.4 2.8-5.4 2.8Z" },
];

/**
 * Real platforms/partners/memberships the user confirmed — scores/
 * counts and profile URLs not known, see file header. Every entry has
 * a subtitle so the row reads clearly without separate group headings.
 */
const TRUST_BADGES: { name: string; href: string; color?: string; colors?: string[]; subtitle: string }[] = [
  { name: "Google", href: "#", colors: ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"], subtitle: "Reviews" },
  { name: "Clutch", href: "#", color: "#EF2D45", subtitle: "Reviews" },
  { name: "Upwork", href: "#", color: "#14A800", subtitle: "Reviews" },
  { name: "Fiverr", href: "#", color: "#1DBF73", subtitle: "Reviews" },
  { name: "Envato", href: "#", color: "#82B540", subtitle: "Author & Reviews" },
  { name: "Framer", href: "#", color: "#0055FF", subtitle: "Partner" },
  { name: "Webflow", href: "#", color: "#4353FF", subtitle: "Partner" },
  { name: "BASIS", href: "#", color: "#9ca3af", subtitle: "Member" },
];

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
    <div className="bg-light-surface p-3 sm:p-4">
      <footer className="theme-light relative overflow-hidden rounded-[32px] bg-canvas pb-10 pt-16" aria-label="Site footer">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 45% at 50% 0%, rgba(124,108,255,0.12), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Social row — top of the footer, large standout badges */}
        <Reveal>
        <div className="flex flex-col gap-5 border-b border-hairline pb-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
            Follow CodeShaper
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-12 w-12 items-center justify-center rounded-full border transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_var(--glow-shadow)]"
                style={
                  {
                    borderColor: `${s.color}55`,
                    backgroundColor: `${s.color}1f`,
                    color: s.color,
                    "--glow-shadow": `${s.color}40`,
                  } as CSSProperties
                }
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Reviews + Partners & Memberships — merged into one compact row, see file header */}
        <Reveal delay={80}>
        <div className="mt-8 border-b border-hairline pb-8">
          <p className="mb-5 font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
            Reviews &amp; Partners
          </p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            {TRUST_BADGES.map((p) => {
              const colors = p.colors;
              const accent = colors ? colors[0] : p.color!;
              return (
                <a
                  key={p.name}
                  href={p.href}
                  className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-hairline px-6 py-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--glow-border)] hover:shadow-[0_12px_30px_var(--glow-shadow)]"
                  style={
                    {
                      "--glow-border": `${accent}66`,
                      "--glow-shadow": `${accent}26`,
                    } as CSSProperties
                  }
                >
                  {colors ? (
                    <span className="font-urbanist text-xl font-bold tracking-tight sm:text-2xl">
                      {p.name.split("").map((ch, i) => (
                        <span key={i} style={{ color: colors[i] }}>{ch}</span>
                      ))}
                    </span>
                  ) : (
                    <span className="font-urbanist text-xl font-bold tracking-tight sm:text-2xl" style={{ color: p.color }}>
                      {p.name}
                    </span>
                  )}
                  <span className="font-urbanist text-[10.5px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                    {p.subtitle}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center" aria-label="CodeShaper home">
              {/* Now that this section is theme-light, the real wordmark
                  lockup (same asset Navbar uses) works directly — no more
                  icon-only badge + hand-reconstructed text-span workaround. */}
              <Image src="/brand/logo.png" alt="codeShaper" width={169} height={60} className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs font-urbanist text-sm leading-relaxed text-ink-faint">
              Product design, web &amp; mobile engineering, commerce, and AI
              automation, with weekly visibility and clean handover.
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

          {/* Link panel — one bordered card, divided internally instead of loose columns.
              Three columns, not four: Blog (the only live Insights page) moved into the
              company row below instead of anchoring its own near-empty column — see file header. */}
          <div className="overflow-hidden rounded-[28px] border border-hairline bg-light-surface">
            <div className="grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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

              {/* Industries — its own 2-col sub-grid: short one-word items read
                  denser this way, and it trims the column to 3 rows instead of 6,
                  closer to its siblings' height. */}
              <div className="p-6 sm:p-7">
                <ColHead>Industries</ColHead>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
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
                    <Link href="/engagement" className={colLink}>All engagement models →</Link>
                  </li>
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
            © {new Date().getFullYear()} CodeShaper. All rights reserved.
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
    </div>
  );
}
