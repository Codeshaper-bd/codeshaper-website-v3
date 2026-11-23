# 02 · Spacing & composition

## Scale

Tailwind's 4px base. Use the steps below; anything else needs a reason.

| Token (Tailwind) | px | Typical use |
|---|---|---|
| `1` / `1.5` | 4 / 6 | icon ↔ text, dot ↔ label |
| `2` / `2.5` | 8 / 10 | chips in a row, tight label stacks |
| `3` / `4` | 12 / 16 | card frame padding (`p-3`), field gaps, gutter on phones |
| `5` / `6` | 20 / 24 | gap between cards, card inner padding on phones, list items |
| `8` | 32 | card inner padding (desktop), gap between blocks inside a card |
| `10` | 40 | header → content on phones (`mt-10`), container gutter at `lg` |
| `14` | 56 | header → content on desktop (`lg:mt-14`) |
| `16` | 64 | section padding on phones (`py-16`) |
| `24` | 96 | section padding on desktop (`lg:py-24`) |

## The standard section skeleton

```tsx
// page-background section
<section className="theme-light relative bg-light-surface py-16 lg:py-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
    {/* header: eyebrow + title, optional right-aligned button */}
    {/* content starts mt-10 lg:mt-14 */}
  </div>
</section>

// white floating-card section
<div className="bg-light-surface p-3 sm:p-4">
  <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">…</div>
  </section>
</div>
```

`p-3 sm:p-4` is the **frame**: the 12/16px strip of page background around a white card. It is what makes the cards float; keep it identical everywhere.

## Proximity rules

- Label ↔ value: 2–6px. Title ↔ its paragraph: 12px. Paragraph ↔ action: 24–32px.
- Inside a card, the space *between* groups (≥ 20px) must be clearly larger than the space *inside* a group (≤ 8px).
- Grids of cards: `gap-5` (20px), `lg:gap-6` (24px) for larger cards.

## Composition

- **Two-column splits** use fractional grids that favour the visual: `lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]` (case studies), `0.9fr / 1.1fr` (At a glance, Leadership header).
- **Headers** sit left with the action button bottom-right (`lg:flex-row lg:items-end lg:justify-between`).
- **Centred layouts** only for short, ceremonial content (hero, team photos heading). Never centre a paragraph longer than two lines.
- **Line length:** paragraphs `max-w-[52ch]`–`[60ch]`; headings `max-w-[16ch]`–`[22ch]` with `text-balance`.
