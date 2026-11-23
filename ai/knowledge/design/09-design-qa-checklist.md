# 09 · Design QA checklist

Run this for every visual change. Report each failed item with its fix or an explicit reason it is accepted.

## 1. Inspect the result (mandatory)
- [ ] Screenshots captured at **1440, 768 and 390px** using the project's screenshot workflow and actually viewed.
- [ ] No browser console errors or obvious hydration/runtime failures.

## 2. System consistency
- [ ] Homepage section type matches the owner-approved sequence: default ↔ white card; no dark homepage sections.
- [ ] Header uses eyebrow + title (+ optional outline action); no homepage sub-heading line.
- [ ] Container is `max-w-7xl` with `px-4 sm:px-6 lg:px-10`, unless a documented composition exception applies.
- [ ] New UI uses semantic tokens from chapter 11; legacy utilities are retained only where migration has not yet been scoped.
- [ ] Radius, spacing, typography and components follow chapters 02, 03, 05, 06 and 11.
- [ ] Services and Products remain visually distinct.

## 3. Hierarchy and composition
- [ ] One clear focal point and one primary action per view.
- [ ] Related items are closer than unrelated groups.
- [ ] Edges align to the shared container or a deliberate grid line.
- [ ] Headings wrap naturally; paragraphs remain readable and not overly wide.
- [ ] A section with a different job does not look like its neighbour by accident.

## 4. Content and trust
- [ ] Every figure, name, logo, quote and review is real or visibly labelled as a placeholder.
- [ ] Copy is specific, plain English and free of unsupported claims.
- [ ] Homepage copy is editable through the established `homeCopy()` / CMS mechanism.

## 5. Accessibility
- [ ] Normal text contrast ≥ 4.5:1; large text and meaningful non-text UI ≥ 3:1.
- [ ] Semantic heading order and landmarks are correct.
- [ ] Meaningful images have useful alt text; decorative images have empty alt text.
- [ ] Keyboard access, visible focus and appropriate control semantics work.
- [ ] Motion respects `prefers-reduced-motion`.

## 6. Responsive and engineering
- [ ] No horizontal page overflow at 390px.
- [ ] Touch targets are at least 40px high.
- [ ] Text and media do not overflow their containers.
- [ ] Below-the-fold content and images use the project's established lazy-loading patterns.
- [ ] `npx tsc --noEmit -p .` passes; build passes when dependencies/environment permit.

## 7. Report
- [ ] State what changed and which principle it serves.
- [ ] State which checks were run and which were not.
- [ ] List unresolved owner decisions, data gaps and known discrepancies.
