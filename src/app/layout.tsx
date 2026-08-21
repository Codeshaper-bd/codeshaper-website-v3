import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="en" className={urbanist.variable}>
      <body>{children}</body>
    </html>
  );
}
