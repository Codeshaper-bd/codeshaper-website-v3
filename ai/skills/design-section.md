---
name: design-section
domain: design
summary: Design or redesign a website section in the Codeshaper system, from goal to verified implementation.
used_by: ui-designer
---

# Skill: design a section

## Inputs
The goal, page and position, owner-supplied content/data, and any relevant CMS ordering or screenshot.

## Steps

1. **Load authority.** Read `AGENTS.md`, `ai/context/decisions.md`, `ai/rules/global.md`, `ai/rules/design.md`, the handbook index and relevant chapters. Read chapter 11 for token/global-style work.
2. **Understand the job.** Name the buyer question this section answers and its one primary action (chapter 08).
3. **Check the decision.** Confirm position, assigned section background, rejected directions and whether CMS controls order. Owner decisions override current code patterns.
4. **Study neighbours.** Inspect the sections above and below. Note theme scope, surface, container, card pattern and focal point. A mismatch in existing code is a finding, not a precedent.
5. **Inventory content.** Use real data only. List missing data and whether it will be hidden or visibly labelled as a placeholder.
6. **Choose the pattern.** Reuse a documented component if it serves the same information job. Keep distinct jobs visually distinct. For a major change, present two options and wait for owner approval.
7. **Implement.** Use semantic tokens, the standard container and section skeleton. Use `SectionEyebrow` + `SectionTitle`; no homepage sub-heading line. Keep copy editable via `homeCopy()` / CMS. Keep interactions accessible and reduced-motion aware.
8. **Verify code.** Run `npx tsc --noEmit -p .`; run build when dependencies and environment permit. Report any blocked checks.
9. **Look.** Capture and inspect screenshots at 1440/768/390px with `node scripts/ai/screenshot.mjs`. Do not claim visual verification without opening the images.
10. **QA and report.** Complete chapter 09. Report what changed, which principles it serves, verification results, remaining discrepancies and real data needed.
