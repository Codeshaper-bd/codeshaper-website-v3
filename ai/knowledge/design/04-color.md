# 04 · Colour

The homepage is a light, neutral interface. Colour communicates hierarchy, interaction or status; it is not decoration. All new homepage components use semantic tokens from [11 · Design tokens](11-design-tokens.md).

## Semantic roles (preferred for new work)

| Role | Utility | Light value | Use |
|---|---|---:|---|
| Page | `bg-page` | `#f5f4f2` | Default homepage sections and white-card frame |
| Surface | `bg-surface` | `#ffffff` | White cards and floating sections |
| Soft surface | `bg-surface-soft` | `#f6f4f1` | Warm nested panels (media panels behind product and case-study screens) |
| Primary content | `text-content` | `#0b0f19` | Headings and primary text |
| Muted content | `text-content-muted` | `#626873` | Supporting copy and labels |
| Subtle content | `text-content-subtle` | `#626873` | Metadata; do not lower contrast |
| Border | `border-border` | `rgba(11,15,25,.08)` | Hairlines and card outlines |
| Strong border | `border-border-strong` | `#d1d5db` | Selected/focused boundaries |
| Brand | `text-brand`, `bg-brand` | `#615fff` | Small highlights, map markers and focus indication |
| Brand soft | `bg-brand-soft` | `rgba(97,95,255,.12)` | Restrained selection/focus background |

Status tokens: success `#16a34a`, info `#0284c7`, warning `#d97706`, danger `#dc2626`. Use only when the status meaning is real. Product accents (Acculance `#1d5f9e`, Dashcode `#6366f1`, Banizo `#f59e0b`) belong to their own product identity and screen, never global page chrome.

## Legacy compatibility

`canvas`, `light-surface`, `ink`, `hairline-*` and `aurora-*` utilities remain in the codebase. They are compatibility aliases, not the preferred vocabulary for new components. In particular, `aurora-*` may resolve to neutral Zinc shades in `.theme-light`; it does not necessarily mean brand indigo. Avoid raw hex values when a semantic token exists.

## Rules

1. **Neutral first.** Ink on white and warm off-white. One small brand accent per section at most.
2. **Contrast.** Normal text ≥ 4.5:1; large text and meaningful non-text UI ≥ 3:1. Do not lighten muted text below the approved values.
3. **No arbitrary greys.** Use semantic content and border tokens, or a justified opacity of primary content.
4. **Shadows stay quiet and neutral.** No coloured glows or ambient glow blobs.
5. **Gradients are exceptional.** Use only where an existing, approved visual needs a restrained media wash. Never use gradient text, gradient buttons or decorative blobs.
6. **Status colour is semantic.** Do not use green, amber or red merely to add variety.
