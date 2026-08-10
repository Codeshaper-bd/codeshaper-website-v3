import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Typography — Geom (headings) + Manrope (body), both self-hosted through
 * next/font/local so Next emits <link rel="preload"> and a metric-matched
 * fallback (size-adjust). That keeps font swap from shifting layout.
 * Files live in src/fonts and come from the @fontsource packages.
 */
const geom = localFont({
  src: [
    { path: "../fonts/geom-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/geom-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-geom",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

const manrope = localFont({
  src: "../fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-manrope",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

const satoshi = localFont({
  src: [
    { path: "../fonts/satoshi-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/satoshi-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/satoshi-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-satoshi",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

// SEO decision (Pass 1 §2): visible H1 stays short/human; keyword line lives here.
export const metadata: Metadata = {
  title:
    "Product Design, Web & Mobile App Development, eCommerce & AI Automation | Codeshaper",
  description:
    "Codeshaper helps teams design, build, modernize, and automate digital products — with weekly visibility, clean handover, and flexible engagement models.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geom.variable} ${manrope.variable} ${satoshi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
