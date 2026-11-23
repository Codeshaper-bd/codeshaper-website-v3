---
name: design-review
domain: design
summary: Audit a page or section against the Codeshaper handbook and return ranked, actionable findings.
used_by: design-reviewer
---

# Skill: design review

## Inputs
A URL path (e.g. `/`, `/products`) and optionally a section (`#products-heading`), or a screenshot from the owner.

## Steps

1. **Capture.** `node scripts/ai/screenshot.mjs --url <path> [--selector "<css>"] [--full]` → PNGs at 1440 / 768 / 390. Open every image.
2. **Read the code** of the section(s) in `src/components/sections/` to confirm what you see (classes, tokens, primitives).
3. **First impression (5 seconds):** what is seen first, second, third? Is that the right order for the section's job?
4. **Walk the principles** (`ai/knowledge/design/01-visual-principles.md`): hierarchy, contrast, alignment, proximity, repetition, balance, whitespace, scale, rhythm, unity.
5. **Check the system:** rules in `ai/rules/design.md`, owner decisions, chapters 02–07 (spacing, type, colour, layout, components, imagery).
6. **Check conversion** (`08-ux-conversion.md`): the buyer's question answered? one primary action? proof next to the decision?
7. **Check accessibility and responsiveness** (QA checklist sections 5–6).
8. **Rank** findings Blocker / Major / Minor; give each a concrete fix (component, class, value).
9. **Report** in the table format from `ai/agents/design-reviewer.md`, plus what already works. Mark assumptions as assumptions.
