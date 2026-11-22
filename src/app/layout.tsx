import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { heroInter } from "@/components/hero/heroFont";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { COMPANY_POSITIONING } from "@/data/services";
import { SITE } from "@/lib/siteSettings";

/**
 * Typography — Urbanist, self-hosted through next/font/local so Next emits
 * <link rel="preload"> and a metric-matched fallback (size-adjust). That
 * keeps font swap from shifting layout. File lives in src/fonts and comes
 * from the @fontsource/urbanist package.
 *
 * Two families: Urbanist for headings and the wordmark (character), Inter
 * for reading (paragraphs, descriptions, menus, buttons: tall x-height, open
 * shapes, clear at 12-14px). Inter is self-hosted too (next/font/google
 * downloads it at build time); its variable is --font-hero (heroFont.ts).
 * The split itself is in globals.css ("Typography split").
 */
const urbanist = localFont({
  src: [
    { path: "../fonts/urbanist-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/urbanist-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/urbanist-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/urbanist-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-urbanist",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

// SEO decision (Pass 1 §2): visible H1 stays short/human; keyword line lives here.
const TITLE = SITE.seo.title ?? `${COMPANY_POSITIONING} | ${SITE_NAME}`;
// REVIEW
const DESCRIPTION =
  SITE.seo.description ??
  "CodeShaper is an AI engineering & software development company building reliable, production-ready AI and software that integrates with your existing tools.";

// viewport-fit=cover lets the mobile tab bar and sheet pad themselves with
// env(safe-area-inset-bottom), clear of the iPhone home indicator.
export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    ...(SITE.seo.image ? { images: [SITE.seo.image] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  ...(SITE.seo.google || SITE.seo.bing
    ? { verification: { google: SITE.seo.google, ...(SITE.seo.bing ? { other: { "msvalidate.01": SITE.seo.bing } } : {}) } }
    : {}),
};

/**
 * Organization + WebSite JSON-LD. Only facts that are actually true are
 * asserted here: name, the real logo (public/brand/logo.png, supplied
 * directly by the client), and (placeholder, see lib/site.ts) URL. Contact
 * details and `sameAs` appear once they are filled in the CMS. No
 * `SearchAction` (there's no on-site search to back that claim up).
 */
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  description: DESCRIPTION,
  ...(SITE.contact.email ? { email: SITE.contact.email } : {}),
  ...(SITE.contact.phone ? { telephone: SITE.contact.phone } : {}),
  ...(SITE.contact.address ? { address: SITE.contact.address } : {}),
  ...(SITE.contact.social ? { sameAs: Object.values(SITE.contact.social) } : {}),
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${urbanist.variable} ${heroInter.variable}`}>
      {/*
        suppressHydrationWarning is scoped to this element's own attributes
        only (not descendants) — it's the standard Next.js/React mitigation
        for browser extensions (Grammarly, etc.) that inject attributes like
        data-gr-ext-installed onto <body> before React hydrates, which would
        otherwise always mismatch server vs. client markup. It does not hide
        any other hydration issues elsewhere in the tree.
      */}
      <body suppressHydrationWarning>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
      </body>
    </html>
  );
}
