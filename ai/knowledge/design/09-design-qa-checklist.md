# 09 · Design QA checklist

Run this on every visual change before calling it done. Report each failed item with the fix (or why it is accepted).

## 1. Look at it (mandatory)
- [ ] Screenshots taken at **1440**, **768** and **390** px (`node scripts/ai/screenshot.mjs …`) **and actually viewed**.
- [ ] No console errors on the page.

## 2. System
- [ ] Section type fits the rhythm (default ↔ white card alternate; no dark section).
- [ ] Header is `SectionEyebrow` + `SectionTitle` (+ optional outline button). No sub-heading paragraph.
- [ ] Container `max-w-7xl` + gutters `px-4 sm:px-6 lg:px-10`; section padding `py-16 lg:py-24`.
- [ ] Only existing tokens, radii (32/28/20–24/12/full), shadows and the two typefaces.
- [ ] Buttons, chips, cards and inputs match [06-components](06-components.md).

## 3. Hierarchy and composition
- [ ] One clear focal point; one primary action.
- [ ] Related items closer than unrelated ones; groups separated by ≥ 20px.
- [ ] Everything aligns to the container edge or an obvious grid line.
- [ ] Headings balanced (no single word on the last line); paragraphs ≤ 60ch.
- [ ] Does not look like a neighbouring section that does a different job.

## 4. Content and honesty
- [ ] Every number, name, logo and quote is real, or carries a visible Placeholder label.
- [ ] Copy is short, specific, plain English; CTA says what happens.
- [ ] Words come from `homeCopy()` / the CMS (editable), not hard-coded, for homepage sections.

## 5. Accessibility
- [ ] Text contrast ≥ 4.5:1 (≥ 3:1 for large text/icons); no `ink-dim` lightened.
- [ ] Real headings in order (`h2` per section, `h3` inside); landmark `aria-labelledby`.
- [ ] Images have correct `alt` (empty when decorative); icons `aria-hidden`.
- [ ] Keyboard: everything reachable, visible focus, tabs/accordions use proper roles.
- [ ] Animation respects `prefers-reduced-motion`.

## 6. Responsive and performance
- [ ] No horizontal page scroll at 390px; tap targets ≥ 40px.
- [ ] Text never overflows its card; long names and labels wrap gracefully.
- [ ] Below-the-fold sections are lazy (`LazySection`) and images lazy with honest `sizes`.
- [ ] `npx tsc --noEmit -p .` passes.

## 7. Report
- [ ] What changed and **which principle** each change serves.
- [ ] What still needs real data from the owner.
