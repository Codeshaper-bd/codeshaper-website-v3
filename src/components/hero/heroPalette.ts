/**
 * Single colour source for the hero's flowing light (Hero.tsx) and the
 * globe's atmosphere (HeroGlobe.tsx). Both render one layer per palette with
 * the `.hg-layer` class, so they share the same CSS keyframes and delays,
 * i.e. the same clock. Never add a second colour cycle elsewhere.
 */

/** Seconds each palette leads; must match the 40s `hg-cycle` in globals.css. */
export const SLOT = 8;

/** animation-delay for palette i (palette 0 is mid-hold on first paint). */
export const paletteDelay = (i: number) => `${i * SLOT - SLOT / 2}s`;

/** Bottom-centre ellipse; each palette ends in the page colour so layers are opaque. */
const glow = (stops: string) => `radial-gradient(ellipse 84% 96% at 50% 103%, ${stops})`;

export const PALETTES: { name: string; gradient: string; accent: string }[] = [
  {
    name: "violet",
    gradient: glow("#4f6bff 0%, #8676ff 14%, #c08aff 28%, #dcc6ff 44%, #eee6ff 60%, #ffffff 78%"),
    accent: "124, 108, 255",
  },
  {
    name: "sunset",
    gradient: glow("#d98cf2 0%, #ff8fbf 14%, #ffa98a 27%, #ffc970 41%, #ffe3ba 57%, #fff4e8 70%, #ffffff 84%"),
    accent: "246, 128, 178",
  },
  {
    name: "sky",
    gradient: glow("#1b78cc 0%, #4f9be0 14%, #8cc1f2 30%, #bfddfb 46%, #e3effd 62%, #ffffff 80%"),
    accent: "64, 146, 222",
  },
  {
    name: "dawn",
    gradient: glow("#f7a63f 0%, #f3bd70 13%, #dccaa9 25%, #b5d3f4 39%, #d4e7fc 55%, #edf5fe 69%, #ffffff 84%"),
    accent: "242, 160, 72",
  },
  {
    name: "coral",
    gradient: glow("#ffa26c 0%, #ff8e92 13%, #f09cc6 26%, #d6a9ff 40%, #e9d5ff 56%, #f6eefd 70%, #ffffff 84%"),
    accent: "250, 132, 140",
  },
];
