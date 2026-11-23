# 03 · Typography

## Typefaces and roles

| Family | Role | Implementation |
|---|---|---|
| **Urbanist** (400–700) | Headings, eyebrows, buttons and expressive UI text | `font-urbanist`; local font loaded in `src/app/layout.tsx` |
| **Inter** (variable) | Reading/body text and hero copy | The default body font (`body` uses `var(--font-hero)` in `globals.css`); loaded through `src/components/hero/heroFont.ts`. **No class is needed**; there is no `font-hero` utility. |

Two families only. Do not add a third typeface or use a font role inconsistently. Some components explicitly set Urbanist; unqualified body text inherits the site reading font.

## Type scale

| Role | Size | Weight | Line height / tracking |
|---|---|---|---|
| Hero heading | Responsive 28–52px | 580 (Inter) | ~1.1 / tight negative tracking |
| Section title | 30–36px; large variants 36–48px | 700 | Tight; use `text-balance` |
| Lead card headline | 26–36px | 700 | 1.08–1.15 |
| Card title | 17–22px | 700 | Tight |
| Body | 14.5–15px | 400 | Relaxed (~1.625) |
| Small / meta | 12–13.5px | 400–600 | Snug; avoid for decision-critical copy |
| Eyebrow | 11px uppercase | 500 | Tracking ~0.28em |
| Figures | 38–44px | 700 | Tabular numerals; tight tracking |

## Rules

1. Reuse `SectionEyebrow`, `SectionTitle` and `SectionDescription` from `src/components/system/SectionHeading.tsx` where appropriate.
2. Establish hierarchy with size, spacing and colour before increasing weight.
3. Use `text-balance` on headings and `text-pretty` on short paragraphs where supported.
4. Keep paragraph measure near 52–60ch; body copy should normally be 45–75 characters per line depending on viewport.
5. Uppercase is reserved for eyebrows and tiny metadata labels, with deliberate tracking.
6. Use `tabular-nums` for comparable figures, prices and statistics.
7. Do not use text below 11px. Anything visitors need to read to make a decision should normally be at least 13px.
8. Copy is concise, specific, plain English and active voice. Avoid hype and unsupported claims.
