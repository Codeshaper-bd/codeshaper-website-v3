# 01 · Visual principles

Ten principles. Every design decision, and every review comment, should name the principle it serves. "It looks better" is not a reason; "the CTA now wins the hierarchy" is.

| Principle | What it means here | Codeshaper example |
|---|---|---|
| **Hierarchy** | One thing is seen first, then the next. | Section: eyebrow (small, grey) → title (large, ink) → content → one action. |
| **Contrast** | Difference creates attention; use it sparingly. | Black pill button on white is the only high-contrast element in a card. |
| **Alignment** | Everything sits on a shared edge. | All section content aligns to the `max-w-7xl` container's left edge. |
| **Proximity** | Related things sit closer than unrelated things. | Product name and category: 2px apart; product and its spec sheet: 20px. |
| **Repetition** | The same job looks the same everywhere. | Every section header uses `SectionEyebrow` + `SectionTitle`. |
| **Balance** | Visual weight is distributed on purpose. | Case study cards: text left (0.85fr), media right (1.15fr). |
| **Whitespace** | Empty space is a design element, not waste. | 96px top/bottom on sections at desktop; cards are never crammed. |
| **Scale** | Size shows importance. | Figures in "At a glance" are 44px; their labels 13px. |
| **Rhythm** | A predictable beat down the page. | Background alternates: page → white card → page → white card. |
| **Unity** | It all looks like one company made it. | One typeface pair, one ink, one accent, one radius family. |

## Decision rules

- **Remove before you add.** If a section feels weak, first try removing an element; adding decoration is the last resort.
- **One star per view.** Each section has exactly one focal point (the biggest, darkest or most colourful thing). If two things compete, demote one.
- **Content first.** Design around the real words and real images. Never design with lorem ipsum and hope.
- **Same job, same look.** Before creating a new card, button or chip, check [06-components](06-components.md).
- **Distinct jobs, distinct looks.** Two sections that do different jobs (e.g. Services vs Products) must not share a card pattern.

## Smells (stop and rethink)

- Three or more accent colours in one section.
- Text centred in long paragraphs (> 2 lines).
- A section that needs an explanatory sub-heading to make sense.
- Blur blobs, glow halos or gradients added "for depth".
- Icons on every line of a list.
- Everything bold, or everything the same size.
