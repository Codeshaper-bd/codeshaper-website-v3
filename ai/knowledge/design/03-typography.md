# 03 · Typography

## Typefaces

| Family | Role | How it is loaded |
|---|---|---|
| **Urbanist** (400–700) | headings, eyebrows, buttons, UI labels, most section text (`font-urbanist`) | `next/font/local`, `src/fonts/` |
| **Inter** (variable) | the hero copy and body reading text (`--font-hero`) | `src/components/hero/heroFont.ts` |

Two families only. Never add a third.

## Type scale (in use today)

| Role | Size | Weight | Line height / tracking | Where |
|---|---|---|---|---|
| Hero heading | 28 → 34 → 40 → 44 → 48 → 52px (`clamp` → `sm` → `lg` → `xl` → `2xl`) | 580 (Inter) | 1.1 / -0.032em | `Hero.tsx` |
| Section title | 30px → 36px (`text-3xl sm:text-4xl`); large: 36 → 48 | 700 | tight / tight | `SectionTitle` |
| Card headline (lead) | 26–36px | 700 | 1.08–1.15 / -0.025em | case study, product lead |
| Card title | 17–22px | 700 | tight / tight | products, leadership, blog list |
| Body | 14.5–15px | 400 | relaxed (1.625) | `SectionDescription`, card paragraphs |
| Small / meta | 12–13.5px | 400–600 | snug | spec rows, meta lines, legends |
| Eyebrow | 11px uppercase | 500 | tracking 0.28em | `SectionEyebrow` |
| Figures | 38–44px | 700 | none / -0.04em, `tabular-nums` | At a glance |

## Rules

1. **Use the primitives.** `SectionEyebrow`, `SectionTitle`, `SectionDescription` (`src/components/system/SectionHeading.tsx`). Never hand-roll a section heading.
2. **Hierarchy by size and colour, not by weight alone.** Titles are ink; supporting text is `text-ink-dim`.
3. **`text-balance` on headings, `text-pretty` on short paragraphs**, so lines break evenly and no single word is left alone.
4. **Line length** 45–75 characters for paragraphs (`max-w-[52ch]`–`[60ch]`).
5. **Uppercase only for eyebrows and tiny tags**, always with extra letter-spacing.
6. **Numbers** that compare (figures, prices, stats) use `tabular-nums`.
7. **No text smaller than 11px**, and nothing under 13px for anything a visitor must read to decide.
8. **Copy style:** short sentences, plain English, active voice, no hype words ("revolutionary", "cutting-edge"), no exclamation marks.
