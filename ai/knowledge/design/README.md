# Codeshaper Design Handbook

The single reference for how the Codeshaper website looks, reads and converts. Written for designers, developers and AI assistants alike. **Every value here exists in the code today**; if the code and this handbook disagree, fix one of them in the same change.

> Direction in one line: **clean white, minimal, premium, factual.** It should feel like a serious engineering company that also has taste, never like a template or an AI demo.

## Chapters

| # | Chapter | Read it when you… |
|---|---|---|
| 01 | [Visual principles](01-visual-principles.md) | do any design work (start here) |
| 02 | [Spacing & composition](02-spacing.md) | place, size or space anything |
| 03 | [Typography](03-typography.md) | write or style text |
| 04 | [Colour](04-color.md) | pick any colour, border or shadow |
| 05 | [Layout & section rhythm](05-layout.md) | add, move or build a section |
| 06 | [Components](06-components.md) | need a button, card, chip, input, heading |
| 07 | [Images & visuals](07-imagery.md) | use photos, screenshots, maps, illustrations |
| 08 | [UX & conversion](08-ux-conversion.md) | write copy, CTAs, proof, forms |
| 09 | [Design QA checklist](09-design-qa-checklist.md) | finish any change (mandatory) |
| 10 | [Learning path](10-learning-path.md) | want to get better at all of the above |

Related: design rules (always on) in [`ai/rules/design.md`](../../rules/design.md) · the owner's decisions in [`ai/context/decisions.md`](../../context/decisions.md) · workflows in [`ai/skills/`](../../skills/) · chat prompts in [`ai/prompts/`](../../prompts/).

## The owner's decisions

Standing design decisions from the owner (homepage order, no dark sections, no sub-headings, products ≠ services, nothing AI-looking, real data only, hero action) live in [`ai/context/decisions.md`](../../context/decisions.md). They override general best practice.

## How to use this as an AI assistant

1. Read `AGENTS.md`, [`ai/rules/design.md`](../../rules/design.md), this file, and the chapters relevant to the task.
2. Open two or three neighbouring sections in `src/components/sections/` and match their patterns.
3. Build, then screenshot (`node scripts/ai/screenshot.mjs`) and look at the images yourself.
4. Run [the QA checklist](09-design-qa-checklist.md) and report: what changed, why (which principle), what still needs real data.
