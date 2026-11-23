---
name: design-review
domain: design
summary: Audit a page or section against the Codeshaper handbook and return ranked, actionable findings.
used_by: design-reviewer
---

# Skill: design review

## Inputs
A URL path (e.g. `/`, `/products`), section selector and/or owner-provided screenshots.

## Steps

1. **Load authority.** Read owner decisions, global/design rules, handbook index and relevant chapters (especially 01, 05, 09 and 11).
2. **Capture.** Use `node scripts/ai/screenshot.mjs` at 1440/768/390px when the environment permits. Open every screenshot. If unavailable, state that the review is code/screenshot-input-only.
3. **Read the code.** Inspect the target component, theme scope, tokens, CMS/fallback ordering and neighbouring sections.
4. **Separate evidence.** Mark each item as confirmed from screenshot/code, inferred, or not verifiable. Do not treat a current implementation as owner approval.
5. **First impression.** Identify what is seen first, second and third; compare that hierarchy with the section's information job.
6. **Evaluate.** Check principles 01, spacing 02, typography 03, colour 04, layout 05, components 06, imagery 07, conversion 08 and QA 09.
7. **Rank.** Blocker = owner-decision violation/accessibility failure; Major = hierarchy, trust, conversion or responsive issue; Minor = polish.
8. **Report.** Use a table with severity, location, evidence, principle and specific fix. Include what already works and what remains unverified.
