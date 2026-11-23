import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, Clock, Download, FileText, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiBehance, SiDribbble, SiFacebook, SiGithub, SiPinterest } from "react-icons/si";
import { SITE } from "@/lib/siteSettings";
import { SERVICE_GROUPS, servicePath } from "@/data/services";
import FooterWordmark from "./FooterWordmark";
import FooterStage from "./footer/FooterStage";
import LocalTime from "./footer/LocalTime";
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
 *  1. Left: logo, company profile (download once the PDF is in
 *     public/media), contact lines, social links, BASIS. Right: four link
 *     columns (Services, Company, Useful links, Tools).
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

/**
 * Company facts as published on codeshaper.net's footer (owner-supplied,
 * 23 Nov 2026). Used until the same fields are filled in CMS › Settings ›
 * Contact and social, which then win field by field.
 */
const PUBLISHED = {
  email: "info@codeshaper.net",
  support: "support@codeshaper.net",
  phone: "+880-1754218741",
  whatsapp: "+8801787662759",
  social: {
    facebook: "https://www.facebook.com/Codeshaperbd/",
    x: "https://twitter.com/codeshaperbd",
    linkedin: "https://www.linkedin.com/company/codeshaper",
    pinterest: "https://www.pinterest.com/codeshaperbd/",
    behance: "https://www.behance.net/codeshaper",
  } as Record<string, string>,
};
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
type Office = { title: string; lines?: string[]; tel?: string; zone?: string };
// TEMP (owner, 23 Nov 2026): until each branch address arrives, Japan, USA, UK and Australia show the Dhaka address and phone. Replace each with the real one.
const DHAKA = { lines: ["3rd Floor, Road# 29, House# 395,", "New DOHS, Mohakhali, Dhaka 1206"], tel: "+8801787662759" };
const OFFICES: Record<string, Office> = {
  bangladesh: { title: "Operations HQ · Dhaka", lines: ["3rd Floor, Road# 29, House# 395,", "New DOHS, Mohakhali, Dhaka 1206"], tel: "+8801787662759", zone: "Asia/Dhaka" },
  "new zealand": { title: "Global HQ · Auckland", lines: ["3 Herekino Street, Westgate,", "Auckland 0814"], tel: "+64277758777", zone: "Pacific/Auckland" },
  japan: { title: "Office · Japan", zone: "Asia/Tokyo", ...DHAKA }, // TEMP address
  usa: { title: "Office · USA", ...DHAKA }, // TEMP address; add the city for local time
  uk: { title: "Office · UK", zone: "Europe/London", ...DHAKA }, // TEMP address
  australia: { title: "Office · Australia", ...DHAKA }, // TEMP address; add the city for local time
};
const FOUNDED = 2017;

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
  !CMS_CONTACT?.email && { icon: Mail, text: PUBLISHED.support, href: `mailto:${PUBLISHED.support}` },
  CONTACT.phone && { icon: Phone, text: CONTACT.phone, href: `tel:${digits(CONTACT.phone)}` },
  CONTACT.whatsapp && { icon: MessageCircle, text: "WhatsApp", href: `https://wa.me/${digits(CONTACT.whatsapp).replace("+", "")}` },
  CONTACT.address && { icon: MapPin, text: CONTACT.address },
  CONTACT.hours && { icon: Clock, text: CONTACT.hours },
].filter((l): l is { icon: typeof Mail; text: string; href?: string } => Boolean(l));

/** Company: who we are and our work. */
const COMPANY_LINKS = [
  { label: "About us", href: "/company/about" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
/** Useful links: ways to work with us, and finding your way around. */
const USEFUL_LINKS = [
  { label: "Engagement models", href: "/engagement" },
  { label: "Hire dedicated developers", href: "/hire-dedicated-developers" },
  { label: "Staff augmentation", href: "/staff-augmentation" },
  { label: "Industries", href: "/industries" },
  { label: "Sitemap", href: "/site-map" },
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
const DEV = process.env.NODE_ENV !== "production";

const SOCIAL = LIVE_SOCIAL_LINKS;

function SocialRow() {
  if (!SOCIAL.length) return null;
  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {SOCIAL.map((x) => {
          const glyph = x.icon ? <x.icon size={16} aria-hidden /> : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d={x.d} />
            </svg>
          );
          return (
            <li key={x.key}>
              {x.href ? (
                <a
                  href={x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={x.label}
                  className="group grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/60 text-ink shadow-[0_1px_2px_rgba(11,15,25,0.05)] backdrop-blur-md transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white"
                  style={{ ["--brand" as string]: x.color }}
                >
                  <span className="transition-colors duration-300 group-hover:text-[var(--brand)]">{glyph}</span>
                </a>
              ) : (
                <span
                  title={`${x.label}: add the link in CMS › Settings › Contact and social`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-[#0b0f19]/25 text-ink-faint"
                >
                  {glyph}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <FooterStage>
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pb-32 lg:pt-24">
        {/* 1 · brand + links */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label="CodeShaper home">
              <Image src="/brand/logo.png" alt="codeShaper" width={169} height={60} className="h-8 w-auto" />
            </Link>
            {HAS_PROFILE_PDF ? (
              <a
                href={PROFILE_PDF}
                download
                className="group mt-6 flex w-fit items-center gap-2 rounded-full bg-[#0b0f19] py-2 pl-4 pr-2 font-urbanist text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2433]"
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
                  className="group mt-6 flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/60 py-2 pl-4 pr-3 font-urbanist text-[13px] font-semibold text-ink backdrop-blur-md transition-colors hover:bg-white"
                >
                  <FileText size={14} strokeWidth={1.8} aria-hidden />
                  {FOOTER.button.label}
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              )
            )}
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
            <div className="mt-7">
              <SocialRow />
            </div>
            <a
              href="https://basis.org.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100"
              aria-label="Member of BASIS, the Bangladesh Association of Software and Information Services"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the association's own mark (white artwork), shown in ink */}
              <img src="/media/badges/basis.svg" alt="" width={113} height={40} className="h-9 w-auto brightness-0" />
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
              <ColHead>Useful links</ColHead>
              <ul className="space-y-2.5">
                {USEFUL_LINKS.map((l) => (
                  <li key={l.href}><Link href={l.href} className={colLink}>{l.label}</Link></li>
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
                  <span className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4f46e5] backdrop-blur-md">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#4f46e5]" />
                    Coming soon
                  </span>
                </p>
              )}
            </div>
          </nav>
        </div>

        {/* 2 · offices: text, like the link columns (no cards, no photos); each with its local time */}
        {OFFICE_LIST.length > 0 && (
          <Reveal>
            <div className="mt-12 border-t border-[#0b0f19]/[0.08] pt-10">
              <ColHead>Offices</ColHead>
              {/* all six in one row on desktop */}
              <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                {OFFICE_LIST.map((p) => (
                  <li key={p.name}>
                    <p className="font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#4f46e5]">{p.office!.title}</p>
                    <p className="mt-1 font-urbanist text-[15px] font-bold tracking-[-0.01em] text-ink">{p.name}</p>
                    {p.office!.lines?.length ? (
                      <address className="mt-1.5 font-urbanist text-[12.5px] not-italic leading-relaxed text-ink-dim">
                        {p.office!.lines.join(" ")}
                      </address>
                    ) : (
                      DEV && (
                        <p className="mt-1.5 rounded-lg border border-dashed border-[#0b0f19]/25 px-2.5 py-1.5 font-urbanist text-[12px] text-ink-faint">
                          Placeholder (development only): address and phone to add in Footer.tsx, OFFICES.
                        </p>
                      )
                    )}
                    <p className="mt-2 flex flex-col items-start gap-1 font-urbanist text-[12.5px] text-ink-dim">
                      {p.office!.tel && (
                        <a href={`tel:${p.office!.tel}`} className="inline-flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-[#4f46e5]">
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

        {/* 4 · wordmark + legal */}
        <div className="mt-16 overflow-hidden">
          <FooterWordmark />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#0b0f19]/[0.08] pt-6">
          <p className="font-urbanist text-[12.5px] text-ink-dim">
            © {FOUNDED}–{new Date().getFullYear()} {FOOTER.copyright}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/legal/privacy" className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink">Privacy policy</Link>
            <Link href="/legal/terms" className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink">Terms of service</Link>
            <Link href="/site-map" className="font-urbanist text-[12.5px] text-ink-dim transition-colors hover:text-ink">Sitemap</Link>
            <a
              href="#"
              aria-label="Back to top"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/60 text-ink backdrop-blur-md transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-white"
            >
              <ArrowUp size={15} strokeWidth={1.9} />
            </a>
          </div>
        </div>
      </div>
    </FooterStage>
  );
}
