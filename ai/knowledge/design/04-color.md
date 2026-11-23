# 04 · Colour

All homepage sections render inside `.theme-light` (see `src/app/globals.css`), which maps the token names below to light values. Use the **token**, not the hex, wherever a utility exists.

## Semantic roles

| Role | Token / class | Value (light) | Use |
|---|---|---|---|
| Primary text | `text-ink` | `#0b0f19` | headings, important text, values |
| Secondary text | `text-ink-dim` | `#626873` | paragraphs, labels (passes 4.5:1 on `#f5f4f2`) |
| Faint text | `text-ink-faint` | `#626873` | eyebrows, spec-sheet keys (same value: accessibility) |
| Page background | `bg-light-surface` | `#f5f4f2` | the "default" sections and the card frame |
| Card / white surface | `bg-canvas` (in theme-light) / `bg-white` | `#ffffff` | white floating sections, cards |
| Warm panel | `bg-[#f6f4f1]` / `bg-[#f7f6f3]` | warm off-white | media panels inside white cards |
| Hairline | `border-[#0b0f19]/[0.07–0.08]` | 7–8% ink | card and chip borders, dividers |
| Primary action | `bg-[#0b0f19]` + white text | ink | the one main button per view |
| Brand accent | `#615fff` (indigo) | | small highlights only: map points, focus ring, a dot, a check icon |

## Status colours (dots and tiny chips only)

Live `#16a34a` · Beta `#0284c7` · Coming soon `#d97706` · Placeholder chip `bg-[#fef3c7] text-[#92400e]` · Error text `text-red-600`.

## Product colours

Each product has one accent (CMS › Products › Accent colour): Acculance `#1d5f9e`, Dashcode `#6366f1`, Banizo `#f59e0b`. Use it for the app icon, check marks and the product's own screen, never for page chrome or text.

## Rules

1. **Monochrome first.** The site is ink on white and warm off-white. Colour is an accent, not a theme. One accent per section.
2. **Contrast:** body text ≥ 4.5:1, large text and icons ≥ 3:1. `ink-dim` was tuned for this; don't lighten it.
3. **No new greys.** Use ink at an opacity (`/[0.06]`, `/10`) for borders and fills.
4. **Shadows are soft and low:** `shadow-[0_1px_2px_rgba(11,15,25,0.04),0_30px_60px_-40px_rgba(11,15,25,0.35)]` for floating cards. No coloured glows.
5. **Gradients** only as very soft washes behind a product or case-study screen. Never on text or buttons, never as blobs.
