import type { CSSProperties } from "react";

/**
 * Icon tints for the menus: each item gets its own soft colour (Apple-style
 * system hues, slightly muted), so items read apart at a glance. Used as
 * `--tone` by .mega-icon-tile (globals.css), which derives the tile tint,
 * the icon colour and the hover glow from it.
 */
const TONES = [
  "#615fff", // violet (brand)
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#8b5cf6", // purple
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
  "#ec4899", // pink
  "#22c55e", // green
  "#0891b2", // cyan
  "#d946ef", // fuchsia
];

export const tone = (i: number) => ({ "--tone": TONES[i % TONES.length] }) as CSSProperties;
