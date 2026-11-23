# 05 · Layout & section rhythm

## Container and grid

- **Container:** `mx-auto max-w-7xl` (1280px) with gutters `px-4 sm:px-6 lg:px-10` (16 / 24 / 40px).
- **Breakpoints:** Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Design and check at **1440, 768, 390**.
- **Grid:** think in 12 columns at `lg+` (`lg:grid-cols-12`, `lg:col-span-6`), 2 at `md`, 1 on phones. Card grids: `md:grid-cols-2 lg:grid-cols-3` (or 4 for small cards like people).

## Section rhythm (homepage)

Two section types, alternating, never two of the same in a row:

| Type | Markup | Feels like |
|---|---|---|
| **Default** | `section.bg-light-surface` full-bleed | the page itself, warm off-white |
| **White card** | `div.bg-light-surface.p-3.sm:p-4 > section.rounded-[32px].bg-canvas` | a white sheet floating on the page |

The full order and the type of each section is in [ai/context/decisions.md](../../context/decisions.md). When adding or moving a section, keep the alternation; if it breaks, change the new section's type, not its neighbours'.

## Section anatomy

```
[eyebrow]                                   
[Title, max two lines, text-balance]          [optional outline button →]
                     ↓ mt-10 lg:mt-14
[content: one clear pattern: grid, list, split, stage]
                     ↓
[one action, if the section needs one]
```

## Radius family

| Radius | Use |
|---|---|
| 32px | white floating sections, large feature cards (case study, booking form wrapper) |
| 28px | standard cards (products, booking form, FAQ list) |
| 20–24px | inner media panels, small cards |
| 12–14px | browser frames, app icons, inputs (`rounded-xl`) |
| full | buttons, chips, tags, avatars |

Nested radii shrink inward: an inner element's radius ≈ outer radius − padding.

## Responsive rules

- Split layouts stack on phones with the **visual first** only when the visual explains the content (case studies); otherwise text first.
- Horizontal scrollers on phones get `no-scrollbar` and edge-to-edge bleed (`-mx-4 px-4`).
- Never hide important content on phones; reduce it (fewer lines, smaller media) instead.
- Hit targets ≥ 40px tall on touch.
