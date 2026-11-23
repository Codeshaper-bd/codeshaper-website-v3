# 11 · Design tokens & implementation contract

This chapter is the implementation-facing index for the Codeshaper visual system. The owner-approved direction and decisions remain authoritative; this chapter explains how to express them consistently in Tailwind CSS v4 and global CSS.

## Source of truth

1. `ai/context/decisions.md` — owner-approved decisions (highest priority).
2. `src/app/globals.css` — runtime token definitions and compatibility aliases.
3. `ai/knowledge/design/` — design intent, usage and examples.
4. `src/components/system/` — reusable component implementations.

When these disagree, do not silently choose one. Report the conflict, preserve owner decisions, and update the documentation and implementation together in the same approved change.

## Semantic color tokens

Use semantic names for new UI. Avoid introducing raw hex values in components when a token exists.

| Role | Tailwind utility | Light-theme value | Use |
|---|---|---:|---|
| Page background | `bg-page` | `#f5f4f2` | Default homepage section background and white-card frame |
| Main surface | `bg-surface` | `#ffffff` | White floating sections and primary cards |
| Soft surface | `bg-surface-soft` | `#f6f4f1` | Warm nested panels, e.g. media panels behind product and case-study screens |
| Primary content | `text-content` | `#0b0f19` | Headings, values, primary body text |
| Muted content | `text-content-muted` | `#626873` | Supporting text and labels |
| Subtle content | `text-content-subtle` | `#626873` | Metadata and low-priority labels; do not reduce contrast further |
| Border | `border-border` | `rgba(11,15,25,.08)` | Dividers, card and control outlines |
| Strong border | `border-border-strong` | `#d1d5db` | Focus/selected boundaries when a stronger boundary is needed |
| Brand accent | `text-brand`, `bg-brand` | `#615fff` | Small brand markers, map points and focus indicators; not large decorative fills |
| Brand soft | `bg-brand-soft` | `rgba(97,95,255,.12)` | Restrained focus/selection backgrounds |

Status colors are semantic, not brand decoration: success `#16a34a`, info `#0284c7`, warning `#d97706`, danger `#dc2626`. Use them only when the status meaning is real and clear. Product accents are content-owned values and must not become global page chrome.

### Theme scope rule (required)

Every new section and white-card frame must carry `theme-light` when using the new semantic design tokens. These tokens have dark defaults outside `.theme-light`. Never create an unintended dark section.

- Default section: `theme-light` on the `section` itself.
- White-card section: `theme-light` on the outer frame `div` (the inner `section` inherits it).
- `theme-light` is applied per section, not globally: `html`, `body` and `SiteShell` do not carry it (owner decision, 2026-11-23).

### Compatibility aliases

Existing utilities (`bg-canvas`, `bg-light-surface`, `text-ink`, `text-ink-dim`, `border-hairline-light`, `text-aurora-*`) remain available to avoid a risky site-wide migration. New work should use semantic tokens. Do not rename or delete legacy tokens until all usages have been inventoried and migrated in a separate change.

`aurora-*` is a legacy utility family, not a guarantee that the value is a brand hue. In the light theme some of these values are neutral Zinc shades. Use `brand` for the actual indigo brand accent.

## Spacing tokens

Tailwind's default 4px spacing scale remains the baseline. Named tokens are available for repeated structural values:

| Utility | Value | Intended use |
|---|---:|---|
| `py-section` | 64px | Default section vertical padding, compact/mobile baseline |
| `lg:py-section-lg` | 96px | Desktop section vertical padding |
| `p-frame` | 12px | White-card outer frame on small screens |
| `sm:p-frame-lg` | 16px | White-card outer frame from `sm` upward |

Use the standard container `mx-auto max-w-7xl px-4 sm:px-6 lg:px-10`. Use Tailwind spacing steps for local gaps; custom values require a reason tied to content, alignment or responsive behavior.

## Radius tokens

| Utility | Value | Use |
|---|---:|---|
| `rounded-section` | 32px | White floating sections and large feature cards |
| `rounded-card` | 28px | Standard catalogue/content cards |
| `rounded-panel` | 24px | Inner panels and secondary cards |
| `rounded-control` | 12px | Inputs, browser frames and compact controls |
| `rounded-full` | 9999px | Buttons, chips, tags and avatars |

Nested radii should step down with the inner element's padding. Existing arbitrary radii remain compatible; prefer the named utilities for new work.

## Typography contract

- Urbanist: headings, section labels, buttons and expressive UI text (`font-urbanist`).
- Inter: body/reading text and the hero copy. It is the default body font (`body { font-family: var(--font-hero) … }` in `globals.css`, variable provided by `next/font`); text inherits it, so no class is needed. There is no `font-hero` utility.
- Use the role-based type scale in [03-typography](03-typography.md); do not add another font family or invent a new scale per section.

## Exceptions and change control

A one-off value is acceptable only when it solves a specific composition or content constraint and cannot be represented by an existing token. Record the reason in the component or change note. A repeated exception should become a reviewed token. Never create a token solely to make one arbitrary value appear systematic.

## Migration policy

- Existing pages may continue using legacy utilities during this foundation pass.
- New or substantially revised components should use semantic tokens.
- Do not perform mass search-and-replace on legacy class names without checking theme scope and visual output.
- Token changes require type/build validation and visual regression checks at 1440, 768 and 390px.
