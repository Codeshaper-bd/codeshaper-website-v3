import { Inter } from "next/font/google";

/**
 * Inter (variable) for the homepage hero copy only. The rest of the site
 * stays on Urbanist (see layout.tsx). next/font downloads the font at build
 * time and self-hosts it, so visitors never request it from Google, and it
 * is preloaded only on pages that render the hero.
 *
 * Compared side by side with the current font at /dev/hero-font (dev only).
 */
export const heroInter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero",
});
