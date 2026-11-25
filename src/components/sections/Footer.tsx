import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Clock, Download, FileText, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiBehance, SiDribbble, SiFacebook, SiGithub, SiPinterest } from "react-icons/si";
import { SITE } from "@/lib/siteSettings";
import { PUBLISHED } from "@/lib/publishedContact";
import { FOOTER_OFFICES } from "@/lib/offices";
import { SERVICE_GROUPS, servicePath } from "@/data/services";
import { PRODUCTS } from "@/lib/products";
import MarkSvg from "@/components/brand/MarkSvg";
import FooterStage from "./footer/FooterStage";
import Landmark from "./footer/Landmark";
import CookieSettingsLink from "@/components/analytics/CookieSettingsLink";
import FooterLandscape from "./footer/FooterLandscape";
import LocalTime from "./footer/LocalTime";
import FooterActions from "./footer/AskAI";
import Reveal from "@/components/system/Reveal";

/**
 * Footer, round 11 (23 Nov 2026, owner: "premium, a playable mesh gradient,
 * and it should flow out of the newsletter"). Full width, no card: a living
 * pastel mesh gradient (footer/MeshGradient.tsx) rises out of the page
 * background under the newsletter and fills the footer; the pointer bends
 * it and a click ripples it. The one place the "no glow / no decorative
 * gradient" rule is set aside, by the owner's request (decisions.md).
 *
 * Top to bottom:
 *  1. Left: logo, contact lines, BASIS. Right: four link columns
 *     (Services, Company, Products, Tools), and under them one action
 *     row: Follow us, Ask AI about CodeShaper, company profile
 *     (footer/AskAI.tsx). Every icon has a tooltip.
 *  2. Offices, as text (owner + design review, 23 Nov 2026: photo cards
 *     made the footer heavy and stock landmarks read as unproven): address,
 *     phone and live local time, the same for all six offices.
 *  3. The giant wordmark, then the legal bar, with room below it so the
 *     floating menu never sits on the legal links.
 *  (A recognition row was tried and dropped by the owner: the badges live
 *  in "Our journey".)
 *
 * Everything shown is real: the CMS (Settings: contact, social, footer)
 * where filled in, otherwise the facts published on codeshaper.net
 * (PUBLISHED / OFFICES below). BASIS membership as shown on that site.
 */
const { contact: CMS_CONTACT, footer: FOOTER } = SITE;

// company facts as published on codeshaper.net (shared with the booking window)
const CONTACT = {
  ...CMS_CONTACT,
  email: CMS_CONTACT?.email || PUBLISHED.email,
  phone: CMS_CONTACT?.phone || PUBLISHED.phone,
  whatsapp: CMS_CONTACT?.whatsapp || PUBLISHED.whatsapp,
  social: Object.keys(CMS_CONTACT?.social ?? {}).length ? CMS_CONTACT.social : PUBLISHED.social,
};
/**
 * The six offices, all real branches, all shown the same way: role, country,
 * address, phone and local time. Dhaka and Auckland word for word as
 * published on codeshaper.net. The other four: address, phone and city
 * (for the time zone) still to come from the owner; until then a labelled
 * placeholder in development, and nothing invented in production.
 */
// the offices live in lib/offices.ts (shared with the contact page); TEMP stand-in addresses are applied there
const OFFICES = FOOTER_OFFICES;
const FOUNDED = SITE.seo.founded ?? 2017; // CMS › Search and sharing › Company facts › Year founded

/** Shown only with a real profile link (CMS: Settings, Contact and social). */
const SOCIAL_ICONS: { key: string; label: string; color: string; d?: string; icon?: typeof SiGithub }[] = [
  { key: "linkedin", label: "LinkedIn", color: "#0A66C2", d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" },
  { key: "x", label: "X", color: "#0b0f19", d: "M3 3h4.6l4 5.8L16.2 3H21l-6.9 8.9L21.4 21h-4.6l-4.4-6.3L6.6 21H2l7.3-9.3L3 3Z" },
  { key: "instagram", label: "Instagram", color: "#E1306C", d: "M12 2.2c2.7 0 3 0 4.1.06 1.1.05 1.85.23 2.5.48.68.27 1.26.63 1.83 1.2.57.57.93 1.15 1.2 1.83.25.65.43 1.4.48 2.5.06 1.1.06 1.4.06 4.1s0 3-.06 4.1c-.05 1.1-.23 1.85-.48 2.5a4.9 4.9 0 0 1-1.2 1.83 4.9 4.9 0 0 1-1.83 1.2c-.65.25-1.4.43-2.5.48-1.1.06-1.4.06-4.1.06s-3 0-4.1-.06c-1.1-.05-1.85-.23-2.5-.48a4.9 4.9 0 0 1-1.83-1.2 4.9 4.9 0 0 1-1.2-1.83c-.25-.65-.43-1.4-.48-2.5C2.2 15 2.2 14.7 2.2 12s0-3 .06-4.1c.05-1.1.23-1.85.48-2.5.27-.68.63-1.26 1.2-1.83a4.9 4.9 0 0 1 1.83-1.2c.65-.25 1.4-.43 2.5-.48C9 2.2 9.3 2.2 12 2.2Zm0 1.8c-2.65 0-2.97 0-4.02.06-.9.04-1.4.19-1.72.32-.43.17-.74.37-1.07.7-.33.33-.53.64-.7 1.07-.13.32-.28.82-.32 1.72C4.11 9 4.1 9.32 4.1 12s0 2.97.06 4.02c.04.9.19 1.4.32 1.72.17.43.37.74.7 1.07.33.33.64.53 1.07.7.32.13.82.28 1.72.32 1.05.06 1.37.06 4.03.06s2.97 0 4.02-.06c.9-.04 1.4-.19 1.72-.32.43-.17.74-.37 1.07-.7.33-.33.53-.64.7-1.07.13-.32.28-.82.32-1.72.06-1.05.06-1.37.06-4.02s0-2.97-.06-4.02c-.04-.9-.19-1.4-.32-1.72a2.9 2.9 0 0 0-.7-1.07 2.9 2.9 0 0 0-1.07-.7c-.32-.13-.82-.28-1.72-.32C14.97 4 14.65 4 12 4Zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.8-3.35a1.08 1.08 0 1 1 0 2.15 1.08 1.08 0 0 1 0-2.15Z" },
  { key: "youtube", label: "YouTube", color: "#FF0000", d: "M21.6 7.2s-.2-1.5-.85-2.15c-.8-.85-1.7-.85-2.1-.9C15.9 4 12 4 12 4h-.03s-3.9 0-6.65.15c-.4.05-1.3.05-2.1.9-.65.65-.85 2.15-.85 2.15S2.15 9 2.15 10.8v1.6c0 1.8.22 3.6.22 3.6s.2 1.5.85 2.15c.8.85 1.85.82 2.32.91C7.05 19.2 12 19.25 12 19.25s3.9 0 6.65-.15c.4-.05 1.3-.05 2.1-.9.65-.65.85-2.15.85-2.15s.22-1.8.22-3.6v-1.6c0-1.8-.22-3.6-.22-3.6ZM9.95 14.4V8.8l5.4 2.8-5.4 2.8Z" },
  { key: "facebook", label: "Facebook", color: "#1877F2", icon: SiFacebook },
  { key: "github", label: "GitHub", color: "#0b0f19", icon: SiGithub },
  { key: "dribbble", label: "Dribbble", color: "#EA4C89", icon: SiDribbble },
  { key: "behance", label: "Behance", color: "#1769FF", icon: SiBehance },
  { key: "pinterest", label: "Pinterest", color: "#E60023", icon: SiPinterest },
];
const LIVE_SOCIAL_LINKS = SOCIAL_ICONS.flatMap((s) => (CONTACT.social?.[s.key] ? [{ ...s, href: CONTACT.social[s.key] }] : []));

const digits = (v: string) => v.replace(/[^+\d]/g, "");
const CONTACT_LINES = [
  CONTACT.email && { icon: Mail, text: CONTACT.email, href: `mailto:${CONTACT.email}` },
  // support: CMS › Contact and social › Support email, else the published one
  { icon: Mail, text: CMS_CONTACT?.support || PUBLISHED.support, href: `mailto:${CMS_CONTACT?.support || PUBLISHED.support}` },
  CONTACT.phone && { icon: Phone, text: CONTACT.phone, href: `tel:${digits(CONTACT.phone)}` },
  CONTACT.whatsapp && { icon: MessageCircle, text: "WhatsApp", href: `https://wa.me/${digits(CONTACT.whatsapp).replace("+", "")}` },
  CONTACT.address && { icon: MapPin, text: CONTACT.address },
  CONTACT.hours && { icon: Clock, text: CONTACT.hours },
].filter((l): l is { icon: typeof Mail; text: string; href?: string } => Boolean(l));

/** Company: who we are and our work. */
// owner, 25 Nov 2026: Industries and Sitemap moved here; Products has its own column now
const COMPANY_LINKS = [
  { label: "About us", href: "/company/about" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Industries", href: "/industries" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Sitemap", href: "/site-map" },
];
/** Ways to work with us, under Services (owner, 25 Nov 2026: kept in the footer when "Useful links" became Products). */
const ENGAGE_LINKS = [
  { label: "Engagement models", href: "/engagement" },
  { label: "Hire dedicated developers", href: "/hire-dedicated-developers" },
  { label: "Staff augmentation", href: "/staff-augmentation" },
];
/** Products (owner, 25 Nov 2026, in place of "Useful links"): each product from the CMS (Products), then all of them. */
// CMS › Settings › Footer › Products (each product's own site); the CMS products' pages until that list is filled
const PRODUCT_LINKS = [
  ...(FOOTER.products?.length ? FOOTER.products : PRODUCTS.map((p) => ({ label: p.title, href: `/products/${p.slug}` }))),
  { label: "All products →", href: "/products" },
];
/** Tools: free tools CodeShaper will publish; add each here when it is live (the column says "coming soon" until then). */
const TOOLS: { label: string; href: string }[] = [];

/** The company profile: drop the PDF at public/media/company-profile.pdf and the button becomes a download; until then it opens the CMS link (About). */
const PROFILE_PDF = "/media/company-profile.pdf";
const HAS_PROFILE_PDF = existsSync(join(process.cwd(), "public", PROFILE_PDF));

const colLink = "link-underline font-urbanist text-[13.5px] text-ink-dim transition-colors hover:text-ink";

function ColHead({ children }: { children: string }) {
  return <p className="mb-4 font-urbanist text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">{children}</p>;
}

/** CMS place names → office keys (the CMS spells some countries in full). */
const ALIAS: Record<string, string> = {
  "united states": "usa",
  "united kingdom": "uk",
};
const PLACES = (FOOTER.places ?? []).map((name) => ({ name, office: OFFICES[name.toLowerCase()] ?? OFFICES[ALIAS[name.toLowerCase()] ?? ""] }));
// the two head offices first, then the rest in the CMS order
const OFFICE_LIST = PLACES.filter((p) => p.office).sort((a, b) => Number(/HQ/.test(b.office!.title)) - Number(/HQ/.test(a.office!.title)));

const SOCIAL = LIVE_SOCIAL_LINKS;

export default function Footer() {
  return (
    <FooterStage>
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:px-10 lg:pb-10 lg:pt-24">
        {/* 1 · brand + links */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label="CodeShaper home">
              {/* the same logo as the header (owner, 25 Nov 2026): the mark + the wordmark in the brand face */}
              <span className="flex items-center gap-2">
                <MarkSvg premium pearls className="h-9 w-9 drop-shadow-[0_4px_10px_rgba(97,95,255,0.35)]" id="footer-mark-mask" />
                <span className="font-display text-[23px] font-extrabold leading-none tracking-[-0.02em] text-[#0b0f19] night:text-white">CodeShaper</span>
              </span>
            </Link>
            {CONTACT_LINES.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {CONTACT_LINES.map((l) => (
                  <li key={l.text} className="flex items-start gap-2.5 font-urbanist text-[14px] leading-5 text-ink-dim">
                    <l.icon size={14} strokeWidth={1.75} className="mt-[3px] shrink-0" aria-hidden />
                    {l.href ? (
                      <a href={l.href} className="transition-colors hover:text-ink">{l.text}</a>
                    ) : (
                      <span className="whitespace-pre-line">{l.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <a
              href="https://basis.org.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100"
              aria-label="Member of BASIS, the Bangladesh Association of Software and Information Services"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the association's own mark (white artwork), shown in ink */}
              <img src="/media/badges/basis.svg" alt="" width={113} height={40} loading="lazy" decoding="async" className="h-9 w-auto brightness-0 night:invert" />
              <span className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-dim">Member</span>
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            <div>
              <ColHead>Services</ColHead>
              <ul className="space-y-2.5">
                {SERVICE_GROUPS.map((g) => (
                  <li key={g.slug}><Link href={servicePath(g.slug)} className={colLink}>{g.name}</Link></li>
                ))}
                {ENGAGE_LINKS.map((l) => (
                  <li key={l.href}><Link href={l.href} className={colLink}>{l.label}</Link></li>
                ))}
                <li><Link href="/services" className={colLink}>All services →</Link></li>
              </ul>
            </div>
            <div>
              <ColHead>Company</ColHead>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.href}><Link href={l.href} className={colLink}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <ColHead>Products</ColHead>
              <ul className="space-y-2.5">
                {PRODUCT_LINKS.map((l) => (
                  <li key={l.href}>
                    {/^https?:\/\//.test(l.href) ? (
                      <a href={l.href} target="_blank" rel="noopener" className={colLink}>{l.label}</a>
                    ) : (
                      <Link href={l.href} className={colLink}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ColHead>Tools</ColHead>
              {TOOLS.length ? (
                <ul className="space-y-2.5">
                  {TOOLS.map((l) => (
                    <li key={l.href}><Link href={l.href} className={colLink}>{l.label}</Link></li>
                  ))}
                </ul>
              ) : (
                <p className="max-w-[18ch] font-urbanist text-[13.5px] leading-relaxed text-ink-dim">
                  Free tools for founders and product teams.
                  <span className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4f46e5] backdrop-blur-md night:border-white/10 night:bg-white/5 night:text-[#b4b0ff]">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#4f46e5] night:bg-[#b4b0ff]" />
                    Coming soon
                  </span>
                </p>
              )}
            </div>
          </nav>
        </div>

        {/* one full-width row: follow us (left), ask AI (middle), company profile (right) */}
        <FooterActions
          social={SOCIAL.map((x) => ({
            key: x.key,
            label: x.label,
            href: x.href,
            color: x.color,
            glyph: x.icon ? <x.icon size={16} aria-hidden /> : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d={x.d} />
              </svg>
            ),
          }))}
          profile={
            <>
              {HAS_PROFILE_PDF ? (
                <a
                  href={PROFILE_PDF}
                  download
                  className="group flex w-fit items-center gap-2 rounded-full bg-[#0b0f19] py-2 pl-4 pr-2 font-urbanist text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2433] night:bg-white night:text-[#0b0f19] night:hover:bg-white/85"
                >
                  <FileText size={14} strokeWidth={1.8} aria-hidden />
                  Download company profile
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-y-0.5">
                    <Download size={13} strokeWidth={2} aria-hidden />
                  </span>
                </a>
              ) : (
                FOOTER.button && (
                  <Link
                    href={FOOTER.button.href}
                    className="group flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/60 py-2 pl-4 pr-3 font-urbanist text-[13px] font-semibold text-ink backdrop-blur-md transition-colors hover:bg-white night:border-white/10 night:bg-white/5 night:hover:bg-white/10"
                  >
                    <FileText size={14} strokeWidth={1.8} aria-hidden />
                    {FOOTER.button.label}
                    <ArrowUpRight size={14} strokeWidth={2} aria-hidden className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )
              )}
            </>
          }
        />


        {/* 4 · the six offices in a frosted band, each with a small landmark drawing.
            The CODESHAPER wordmark now stands in the landscape below (owner, 25 Nov 2026). */}
        {OFFICE_LIST.length > 0 && (
          <Reveal>
            <div className="relative z-10 mt-16 rounded-[28px] bg-white/60 px-5 py-7 shadow-[0_30px_60px_-40px_rgba(45,38,120,0.45)] ring-1 ring-white/80 backdrop-blur-xl sm:px-8 sm:py-8 night:bg-white/[0.05] night:shadow-none night:ring-white/10">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0 lg:divide-x lg:divide-[#0b0f19]/[0.07] night:lg:divide-white/10">
                {OFFICE_LIST.map((p) => (
                  <li key={p.name} className="group lg:px-5 lg:first:pl-0 lg:last:pr-0">
                    <Landmark place={p.name} className="text-[#4f46e5] night:text-[#b4b0ff] transition-transform duration-300 group-hover:-translate-y-0.5" />
                    <p className="mt-3 font-urbanist text-[16px] font-bold tracking-[-0.01em] text-ink">{p.office!.title.includes(" · ") && /HQ/.test(p.office!.title) ? p.office!.title.split(" · ")[1] : p.name}</p>
                    {p.office!.lines?.length ? (
                      <address className="mt-1.5 font-urbanist text-[12.5px] not-italic leading-relaxed text-ink-dim">{p.office!.lines.join(" ")}</address>
                    ) : null}
                    <p className="mt-2 flex flex-col items-start gap-1 font-urbanist text-[12.5px] text-ink-dim">
                      {p.office!.tel && (
                        <a href={`tel:${p.office!.tel}`} className="inline-flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-[#4f46e5] night:hover:text-[#b4b0ff]">
                          <Phone size={13} strokeWidth={2} aria-hidden />
                          {p.office!.tel}
                        </a>
                      )}
                      {p.office!.zone && <LocalTime zone={p.office!.zone} />}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#0b0f19]/[0.08] pt-6 night:border-white/10">
          <p className="font-urbanist text-[12.5px] text-ink-dim">
            © {FOUNDED}–{new Date().getFullYear()} {FOOTER.copyright}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/legal/privacy" className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink">Privacy policy</Link>
            <Link href="/legal/terms" className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink">Terms of service</Link>
            <Link href="/site-map" className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink">Sitemap</Link>
            <CookieSettingsLink className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink" />
            <a
              href="#"
              aria-label="Back to top"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/60 text-ink backdrop-blur-md transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-white night:border-white/10 night:bg-white/5 night:hover:bg-white/15"
            >
              <ArrowUp size={15} strokeWidth={1.9} />
            </a>
          </div>
        </div>
      </div>
      {/* 5 · the landscape: hills, a village, the builder putting up a CodeShaper house, and a small game */}
      <FooterLandscape />
    </FooterStage>
  );
}
