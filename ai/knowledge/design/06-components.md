# 06 · Components

Reuse before creating. Inspect the current component before copying a pattern; code is a reference, not authority when it conflicts with owner decisions.

## Section heading

Use `SectionEyebrow` + `SectionTitle` from `src/components/system/SectionHeading.tsx`. A right-side action may be an outline pill. Homepage headings do not have a descriptive sub-heading line.

## Buttons

| Kind | Use | Rule |
|---|---|---|
| Primary pill | Main action in a view/card | Dark ink fill, high contrast, full radius; one primary action per view |
| Outline pill | Secondary navigation/action | Quiet border, white/surface fill, clear label |
| Text link | Low-emphasis secondary action | Underline or clear link affordance; visible focus state |
| Hero link | Quiet alternative to the hero's main chat action | Plain language, visually subordinate |

Use the existing button components/classes as the starting point. Do not introduce a second primary action beside the first. All interactive controls need hover, focus-visible, disabled and keyboard states appropriate to their behavior.

## Cards

| Card job | Pattern | Reference |
|---|---|---|
| Case study | Story + results + testimonial + browser-framed media | `CaseStudiesFeatured.tsx` |
| Service | Capability-focused card with its own service visual | `ServicesShowcase.tsx` and `services-bento/` |
| Product | Catalogue card: screen, app icon, status, promise, spec sheet and action | `ProductsShowcase.tsx` |
| Person | Portrait, name, role and professional link | `Leadership.tsx` |
| Blog | Lead story plus compact reading list | `BlogLatest.tsx` |

Cards that do different jobs must not share a visual pattern by default. In particular, Products must not look like Services.

## Chips and tags

- Category chip: compact, neutral, full-radius outline.
- Status chip: neutral outline plus a semantic status dot and clear text.
- Placeholder chip: warm warning treatment with the explicit word **Placeholder**. Never present an unconfirmed quote, person, metric or logo as real.

## Browser and product frames

Use a restrained browser frame with small neutral window controls, optional host label, rounded corners and a subtle border. Keep the product/site screenshot as the focus.

## Inputs and forms

Use consistent rounded controls, visible labels above fields, clear required/optional state, inline errors and a useful success message. Use semantic border/brand focus tokens. Never rely on placeholder text as the only label.

## Motion

Use existing motion primitives such as `Reveal` when they improve comprehension. Keep hover movement subtle (normally ≤4px), avoid motion that competes with reading, and respect `prefers-reduced-motion` in every animated component.
