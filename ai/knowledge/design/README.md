# Codeshaper Design Handbook

The single reference for how the Codeshaper website looks, reads and converts. It is written for designers, developers and AI assistants. The handbook defines approved design intent; `src/app/globals.css` defines runtime token values. When the two disagree, preserve owner decisions, record the discrepancy and reconcile both in the same approved change.

> Direction in one line: **clean white, minimal, premium, factual.** A serious engineering company with taste — never a template or an AI demo.

## Chapters

| # | Chapter | Read it when you… |
|---|---|---|
| 01 | [Visual principles](01-visual-principles.md) | do any design work (start here) |
| 02 | [Spacing & composition](02-spacing.md) | place, size or space anything |
| 03 | [Typography](03-typography.md) | write or style text |
| 04 | [Colour](04-color.md) | pick any colour, border or shadow |
| 05 | [Layout & section rhythm](05-layout.md) | add, move or build a section |
| 06 | [Components](06-components.md) | need a button, card, chip, input or heading |
| 07 | [Images & visuals](07-imagery.md) | use photos, screenshots, maps or illustrations |
| 08 | [UX & conversion](08-ux-conversion.md) | write copy, CTAs, proof or forms |
| 09 | [Design QA checklist](09-design-qa-checklist.md) | finish any change (mandatory) |
| 10 | [Learning path](10-learning-path.md) | build design judgement systematically |
| 11 | [Design tokens & implementation contract](11-design-tokens.md) | implement or change a design token |

## Authority and precedence

1. Owner-approved decisions in [`ai/context/decisions.md`](../../context/decisions.md).
2. This handbook for design intent and usage.
3. Runtime token definitions in [`src/app/globals.css`](../../../src/app/globals.css).
4. Existing components as implementation references.

If code, handbook and owner decision conflict, do not silently normalize the discrepancy. Record it, explain the impact and reconcile it in a deliberate change. Owner decisions override general best practice.

## How an AI assistant should use this handbook

1. Read `AGENTS.md`, `ai/rules/global.md`, `ai/context/project.md`, `ai/context/architecture.md`, `ai/context/decisions.md` and `ai/rules/design.md`.
2. Read this index and the chapters relevant to the task; read chapter 11 whenever tokens or global styles are involved.
3. Inspect the target component and two neighbouring sections. Check actual theme scope and CMS ordering before changing layout.
4. Reuse system primitives and semantic tokens. Preserve legacy aliases unless a migration is explicitly planned.
5. For a major visual change, present two materially different directions and wait for owner approval.
6. Implement, type-check and inspect screenshots at 1440, 768 and 390px. Run the QA checklist.
7. Report changes, design principles served, verification performed, unresolved discrepancies and owner data still needed.

## Current foundation status

This handbook is a living contract. The following are known migration boundaries, not permission to redesign them implicitly:

- Existing code still uses legacy `aurora-*`, `canvas`, `ink` and raw-value utilities; semantic tokens are preferred for new work.
- Homepage section order is owner-controlled and may be supplied by CMS. The fallback order is not proof that CMS order is correct.
- Any mismatch between an owner-approved section background and its current component implementation must be logged and resolved during the relevant implementation phase.
