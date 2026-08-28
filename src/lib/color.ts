/**
 * Per-item accent colors (violet/blue/green/amber/pink, one per model/
 * project/pin) are picked for visual vibrancy against dark or neutral
 * chrome — several are too light to hit WCAG's 4.5:1 text contrast
 * requirement when used as literal text color on a near-white chip
 * background (confirmed via Lighthouse: violet #8a7bff scored 2.59,
 * amber #e8b04e scored 1.66, both need 4.5). Rather than hand-picking a
 * darker shade per color, this derives one at render time: mixes the
 * accent toward black just enough to clear the target ratio against the
 * given background, so any accent added later is automatically safe.
 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Darkens `hex` toward black by `amount` (0–1). */
function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - amount;
  return rgbToHex([r * f, g * f, b * f]);
}

const bgCache = new Map<string, string>();

/**
 * Returns a shade of `hex` darkened just enough to reach `targetRatio`
 * against `bg` (default the light-theme surface color, #f5f4f2). Falls
 * back to near-black if even full darkening can't reach the target
 * (shouldn't happen for any reasonably saturated/light accent against a
 * light background).
 *
 * Default target is 6.0, well above WCAG AA's 4.5:1 minimum for normal
 * text — every real call site tints its background with the same accent
 * (e.g. `${accent}1a` over a light section), so the ACTUAL rendered
 * background is never quite the plain `bg` this function assumes.
 * Measured empirically: a color tuned to exactly 4.5 against the
 * assumed #f5f4f2 dropped as low as 4.25–4.51 against those real tinted
 * backgrounds — the 6.0 target keeps a margin large enough to absorb
 * that mismatch and still clear 4.5 in practice.
 */
export function textSafeAccent(hex: string, bg = "#f5f4f2", targetRatio = 6.0): string {
  const cacheKey = `${hex}|${bg}|${targetRatio}`;
  const cached = bgCache.get(cacheKey);
  if (cached) return cached;

  const bgRgb = hexToRgb(bg);
  let amount = 0;
  let result = hex;
  for (let i = 0; i <= 80; i++) {
    amount = i / 80;
    const candidate = darken(hex, amount);
    if (contrastRatio(hexToRgb(candidate), bgRgb) >= targetRatio) {
      result = candidate;
      break;
    }
    result = candidate;
  }
  bgCache.set(cacheKey, result);
  return result;
}
