# 06 · Components

Reuse before you create. Each pattern below already exists; copy its classes from the file named.

## Section header: `SectionEyebrow` + `SectionTitle`
`src/components/system/SectionHeading.tsx`. Right-side action: outline pill (below). No sub-heading paragraph on the homepage.

## Buttons

| Kind | Look | When | Reference |
|---|---|---|---|
| **Primary pill** | `bg-[#0b0f19] text-white rounded-full py-2 pl-5 pr-2` + round `bg-white/15` arrow chip that rotates 45° on hover | the one main action in a card or section | `CaseStudiesFeatured.tsx` "Read the case study" |
| **Outline pill** | `rounded-full border border-[#0b0f19]/10 bg-white px-4 py-2.5 text-[13px] font-semibold` + `ArrowRight` | "All case studies", "All products" (section header) | `CaseStudiesFeatured.tsx` |
| **Text link** | `font-semibold underline decoration-[#0b0f19]/20 underline-offset-[5px] hover:decoration-[#0b0f19]` | secondary action next to a primary pill | `ProductsShowcase.tsx` |
| **Hero link** | quiet text + underlined bold link + arrow | "Rather talk? Book a call" | `Hero.tsx` |

States: hover (colour or rotate), `focus-visible` ring (global), `disabled:opacity-60`. Never two primary pills side by side.

## Cards

| Card | Pattern | Reference |
|---|---|---|
| **Case study** | white, `rounded-[32px] p-3`, story left / warm media panel with soft wash right, browser-framed screen | `CaseStudiesFeatured.tsx` |
| **Service (bento)** | white, title top, illustrated UI vignette on a colour wash at the bottom | `services-bento/` |
| **Product (catalogue)** | white `rounded-[28px] p-2.5`, flat screen on top, app icon + name + stage chip, one-line promise, spec sheet (`dl` rows), primary pill + "View product" | `ProductsShowcase.tsx` |
| **Person** | `aspect-[4/5]` portrait `rounded-[22px]` (grayscale → colour on hover), name, role, LinkedIn | `Leadership.tsx` |
| **Blog** | lead story 16:9 + reading list with 4:3 thumbnails | `BlogLatest.tsx` |

Cards that do different jobs must look different (owner rule: products ≠ services).

## Chips and tags

- **Outline chip:** `rounded-full border border-[#0b0f19]/[0.08] bg-white px-2.5 py-1 text-[11.5px]` (industry, category, market).
- **Status chip:** outline chip + 6px status dot (Live / Beta / Coming soon).
- **Placeholder chip:** `bg-[#fef3c7] text-[#92400e] uppercase text-[10.5px]`. Always shown on unconfirmed content.

## Browser frame (for product and website screens)
Three 8px dots `bg-[#0b0f19]/15`, optional host pill, `rounded-[12px]` frame, `border-[#0b0f19]/[0.08]`. Reference: `CaseStudiesFeatured.tsx` `Media`.

## Inputs (forms)
`rounded-xl border border-[#0b0f19]/10 bg-white px-4 py-3 text-[14px]`, focus: `border-[#615fff]/60` + `0 0 0 4px rgba(97,95,255,.12)` ring. Label above, 12.5px semibold. Optional fields say "(optional)". Reference: `BookingForm.tsx`.

## Motion
`Reveal` for entrance (fade + rise, staggered `delay={60 + i * 80}`). Easing `ease-out-expo` / `cubic-bezier(0.16,1,0.3,1)`. Hover lifts ≤ 4px, image zoom ≤ 1.04. Respect `prefers-reduced-motion` (every animated component checks it).
