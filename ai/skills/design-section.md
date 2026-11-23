---
name: design-section
domain: design
summary: Design (or redesign) a website section in the Codeshaper system, from goal to verified code.
used_by: ui-designer
---

# Skill: design a section

## Inputs
The goal (what the section must achieve), the page and position, and any content or data the owner supplied.

## Steps

1. **Understand the job.** Which buyer question does this section answer (`ai/knowledge/design/08-ux-conversion.md`)? What is its one action? Write it in one sentence.
2. **Check the decisions.** `ai/context/decisions.md`: position, background type (default or white card), anything already rejected.
3. **Study the neighbours.** Open the sections above and below in `src/components/sections/`. Note their background, card pattern and focal point. Yours must fit the rhythm and look different if it does a different job.
4. **Inventory the content.** Real data only. List what is missing and how it will show (labelled placeholder or hidden).
5. **Choose the pattern.** Pick from `ai/knowledge/design/06-components.md` first. For a big change, write 2 directions (one line + rough ASCII layout each) and ask the owner before building.
6. **Build.**
   - Wrapper per `05-layout.md` (default or white card), container `max-w-7xl px-4 sm:px-6 lg:px-10`, `py-16 lg:py-24`.
   - Header: `SectionEyebrow` + `SectionTitle` (+ outline button). No sub-heading.
   - Words through `homeCopy("<key>", copy)`; defaults in `src/lib/home-defaults.json` (copy to the CMS file) and CMS fields in `HomeEditor.php` (see `ai/context/architecture.md`).
   - Entrance with `Reveal`; client code only where interaction needs it; lazy-load below the fold.
7. **Look.** `node scripts/ai/screenshot.mjs --url /?intro=off --selector "#<heading-id>"` → open the 3 PNGs and actually inspect them.
8. **QA.** Walk `ai/knowledge/design/09-design-qa-checklist.md`; fix what fails; re-screenshot.
9. **Verify code.** `npx tsc --noEmit -p .` (and CMS tests if CMS changed).
10. **Report** (to the owner): what changed and why (principles), what was checked, what needs real data, 1–3 questions.
