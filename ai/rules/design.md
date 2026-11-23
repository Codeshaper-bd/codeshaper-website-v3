# Design rules (always on for UI, styling, layout and copy work)

Read in this order: `ai/context/decisions.md` → this file → `ai/knowledge/design/README.md` → relevant chapters (always chapter 11 for tokens/global CSS) → `ai/skills/` workflow → target component and its neighbours.

1. **Owner decisions are the authority.** Do not silently override the homepage order, section background assignments, no-dark-section rule, no-subheading rule, product/service distinction or any rejected direction.
2. **Use the design system.** Semantic tokens and their runtime definitions are documented in `ai/knowledge/design/11-design-tokens.md` and `src/app/globals.css`. New UI must use semantic tokens when available.
2a. **Theme scope.** Every new section and white-card frame must carry `theme-light` when using the new semantic design tokens. These tokens have dark defaults outside `.theme-light`. Never create an unintended dark section. (`theme-light` stays per section; it is not applied to `html`, `body` or `SiteShell`.)
3. **Preserve compatibility.** Legacy `canvas`, `light-surface`, `ink`, `hairline-*` and `aurora-*` utilities remain supported. Do not mass-rename or delete them without a scoped migration and visual verification.
4. **Section rhythm.** Homepage sections alternate default page background and white floating-card treatment according to `ai/context/decisions.md`. Never add a dark homepage section. If current code conflicts with the owner-approved sequence, report it; do not copy the conflict as a precedent.
5. **Section header.** Homepage header = eyebrow + title (+ optional outline action). No descriptive sub-heading line.
6. **No synthetic AI aesthetic.** No glow blobs, gradient letter tiles, decorative glass or generic AI art. Use real product imagery, interfaces, diagrams or restrained brand accents where they serve the content.
7. **Distinct jobs, distinct patterns.** Products must not look like Services. Reuse a component only when the information job is the same.
8. **Conversion.** One primary action per view; real proof only; placeholders must be visibly labelled. Homepage copy stays editable through `homeCopy()` / CMS.
9. **Accessibility.** Normal text contrast ≥4.5:1; large text and meaningful non-text UI ≥3:1. Preserve semantic headings, keyboard access, visible focus, useful alt text and reduced-motion support.
10. **Major visual changes need options first.** Present two materially different directions and wait for owner approval before implementation.
11. **Verify.** Type-check, inspect screenshots at 1440/768/390px, run `09-design-qa-checklist.md`, and report checks honestly. Never claim a screenshot, build or test was run if it was not.
