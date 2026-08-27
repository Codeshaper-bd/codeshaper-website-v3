import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import Preloader from "@/components/system/Preloader";
import PageTransition from "@/components/system/PageTransition";

/**
 * Typography — Urbanist, self-hosted through next/font/local so Next emits
 * <link rel="preload"> and a metric-matched fallback (size-adjust). That
 * keeps font swap from shifting layout. File lives in src/fonts and comes
 * from the @fontsource/urbanist package.
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
const TITLE = "Product Design, Web & Mobile App Development, eCommerce & AI Automation | CodeShaper";
const DESCRIPTION =
  "CodeShaper helps teams design, build, modernize, and automate digital products — with weekly visibility, clean handover, and flexible engagement models.";

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
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * Organization + WebSite JSON-LD. Only facts that are actually true are
 * asserted here: name, the real logo (public/brand/logo.png, supplied
 * directly by the client), and (placeholder, see lib/site.ts) URL. No
 * `sameAs` (no real social profile URLs exist anywhere in this project
 * — see Footer.tsx — and a fake one is exactly the kind of unverifiable
 * claim this project avoids everywhere else), no `SearchAction` (there's
 * no on-site search to back that claim up).
 */
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
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
    <html lang="en" className={urbanist.variable}>
      {/*
        suppressHydrationWarning is scoped to this element's own attributes
        only (not descendants) — it's the standard Next.js/React mitigation
        for browser extensions (Grammarly, etc.) that inject attributes like
        data-gr-ext-installed onto <body> before React hydrates, which would
        otherwise always mismatch server vs. client markup. It does not hide
        any other hydration issues elsewhere in the tree.
      */}
      <body suppressHydrationWarning>
        <Preloader />
        <PageTransition>{children}</PageTransition>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
      </body>
    </html>
  );
}
