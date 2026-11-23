# 02 · Spacing & composition

## Base scale

Tailwind's default spacing scale is based on 4px. Prefer its standard steps; use named structural tokens for repeated section/frame values. Any one-off value needs a clear content or composition reason.

| Token / utility | px | Typical use |
|---|---:|---|
| `1` / `1.5` | 4 / 6 | icon ↔ text, dot ↔ label |
| `2` / `2.5` | 8 / 10 | chips and tight label stacks |
| `3` / `4` | 12 / 16 | white-card frame, phone gutters |
| `5` / `6` | 20 / 24 | card gaps and list groups |
| `8` | 32 | desktop card padding and inner groups |
| `10` | 40 | desktop container gutter; use responsive container rules |
| `14` | 56 | larger header-to-content separation |
| `py-section` | 64 | section vertical padding |
| `lg:py-section-lg` | 96 | desktop section vertical padding |

## Standard section skeleton

```tsx
// Default page-background section
<section className="theme-light relative bg-page py-section lg:py-section-lg">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
    {/* SectionEyebrow + SectionTitle; content begins mt-10 lg:mt-14 */}
  </div>
</section>

// White floating-card section
<div className="theme-light bg-page p-frame sm:p-frame-lg">
  <section className="relative overflow-hidden rounded-section bg-surface py-section lg:py-section-lg">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">…</div>
  </section>
</div>
```

The frame is 12px on narrow screens and 16px from `sm` upward. It must remain consistent across white-card sections.

## Proximity

- Label ↔ value: 2–6px. Title ↔ supporting text: 12px. Paragraph ↔ action: 24–32px.
- Inside a card, group spacing (≥20px) should be clearly larger than within-group spacing (≤8px).
- Card grids: `gap-5` (20px), increasing to `lg:gap-6` (24px) when the content needs room.

## Composition

- Two-column splits should weight the content according to its job; case-study media may receive more room than its story copy.
- Section headers align left; optional action aligns to the right/bottom on wide screens.
- Centre only short, intentional content (hero, compact proof, short team heading). Never centre long reading paragraphs.
- Paragraph measure: approximately 52–60ch. Heading measure: approximately 16–22ch, adjusted to the actual words.
- Align edges to the shared container or a deliberate grid line. Avoid arbitrary offsets that cannot be explained by the composition.
