# Design rules (always on for UI, styling, layout and copy work)

Knowledge: `ai/knowledge/design/` · Workflows: `ai/skills/design-section.md`, `ai/skills/design-review.md` · Agents: `ai/agents/ui-designer.md`, `ai/agents/design-reviewer.md`

1. **Follow the system, don't invent one.** Tokens, type scale, spacing, radii, shadows and components from `ai/knowledge/design/`. A new value needs a written reason.
2. **Rhythm:** homepage sections alternate page background (`bg-light-surface`) ↔ white floating card (`p-3 sm:p-4` frame + `rounded-[32px] bg-canvas`). Never two of the same in a row; never a dark section.
3. **Header:** `SectionEyebrow` + `SectionTitle` (+ optional outline button on the right). No sub-heading paragraph.
4. **No AI look:** no glow blobs, gradient letter tiles, decorative glass, sparkle icons, generic AI art.
5. **Distinct jobs, distinct looks:** a new section must not reuse the card pattern of a section that does a different job.
6. **One primary action per view** (black pill); others are outline pills or underlined text links.
7. **Real proof only;** placeholders carry a visible label.
8. **Editable words:** homepage copy via `homeCopy()` + CMS fields, never hard-coded.
9. **Accessible:** contrast ≥ 4.5:1 for text, real heading order, alt text, keyboard reachable, reduced motion respected.
10. **Look at it:** screenshots at 1440 / 768 / 390 (`node scripts/ai/screenshot.mjs`), then `ai/knowledge/design/09-design-qa-checklist.md`, before calling it done.
11. **Big change → options first:** when a section is redesigned, describe or mock 2 directions and let the owner pick.
