import { Inter } from "next/font/google";

/**
 * Inter (variable): the reading font site-wide (paragraphs and small text;
 * layout.tsx exposes --font-hero on <html>) and the homepage hero copy.
 * Headings stay on Urbanist (globals.css "Typography split"). next/font downloads the font at build
 * time and self-hosts it, so visitors never request it from Google, and it
 * is preloaded only on pages that render the hero.

 */
export const heroInter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero",
});
