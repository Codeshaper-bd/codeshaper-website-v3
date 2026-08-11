# Mega menu + nav rebuild (Services, Industries, dropdowns, mobile)

## Context

Round 1 (`docs/superpowers/specs/2026-08-10-light-navbar-hero-design.md`) relit
the navbar and hero to the light indigo/teal theme but kept v3's original
click-through mega-menu IA (a left rail of 5 numbered rows, hover swaps a
detail pane on the right). After seeing it live, the user rejected that IA
outright: "I still don't like the mega menu... it needs to be similar and
better to the reference." The reference is a previously-built static mockup
(`~/Downloads/codeshaper-website-v2-main`) with a different, always-visible
3-column mega menu, a different top-level nav order, and an Industries mega
menu that doesn't exist in v3 at all today (Industries is currently a compact
dropdown).

This round rebuilds the nav bar structure and both mega menus to match the
reference's IA, content, and visual treatment exactly, re-themed onto the
existing `.theme-light` token system (no new palette — the reference's CSS
custom properties already map almost 1:1 onto tokens Round 1 established).
Hero, Trust Strip, and every section below the hero are untouched.

## Nav bar structure

**Current order:** logo → Services (mega) → Industries (dropdown) → How We
Work (dropdown) → Work (link) → Insights (dropdown) → Company (dropdown) →
Book a Call.

**New order:** `Home | Services (mega) | Industries (mega) | Success
Stories (link) | Insights (dropdown) | Company (dropdown)` — then on the
right, `View Work` (secondary ghost pill) + `Book a Call` (primary solid
pill).

- "How We Work" is dropped as a top-level item — it isn't in the reference
  nav and its 3 links (Delivery Process, Engagement Models, Handover &
  Support) are superseded by the new "How We Engage" content inside both
  mega menus (below).
- "Home" becomes a real nav link (currently only the logo links home).
- "Success Stories" and "View Work" both point at the existing `/work`
  route — there's no separate case-studies page yet, and the reference
  itself uses this exact redundant pattern (a subtle text link + a
  persistent button to the same destination).
- Industries changes from a compact dropdown to a full mega menu, structured
  identically to Services.

## Shared content: "How We Engage"

New data, not in `navigation.ts` today. Appears verbatim and identically in
the left column of **both** the Services and Industries mega menus (a soft
gradient-tinted card, 5 rows, icon + title + one-line sub, plus a "Compare
all models →" link at the bottom):

| Icon | Title | Sub | href |
|---|---|---|---|
| `zap` | MVP Sprint | Idea → product in 6–10 weeks | `/engagement/mvp-sprint` |
| `layers` | End-to-End Delivery | Full-cycle product ownership | `/engagement/end-to-end-delivery` |
| `users` | Dedicated Product Team | Embedded team, your roadmap | `/engagement/dedicated-team` |
| `user-plus` | Team Augmentation | Engineers who ramp fast | `/engagement/team-augmentation` |
| `globe` | Global Delivery | Near-shore + offshore hybrid | `/engagement/global-delivery` |

"Compare all models →" → `/engagement`.

## Services mega menu

Replaces `MegaPanel.tsx`'s click-through rail + detail pane with a static
3-column panel — nothing hidden behind hover, everything visible at once.

**Center column — "Core Services":** the existing 5 `SERVICE_COLUMNS`
entries (`design`, `engineering`, `websites`, `commerce`, `ai`), rendered as
a flat vertical list (icon, name, a new one-line comma-joined tag summary,
arrow) instead of the click-through cards. **Order stays the site's existing
numbered order** (design 01 → ai 05), not the reference's AI-first
ordering — this keeps the mega menu consistent with the Service Pillars
section elsewhere on the site, which already uses this numbering. Each
column gets one new field, `tags` (the reference's `mega-svc-tags` line):

| id | tags |
|---|---|
| `design` | Discovery · UX/UI · AI UX · systems · audits · handoff |
| `engineering` | Web apps · mobile · SaaS · MVP · portals · APIs · modernization |
| `websites` | Premium sites · WordPress · landing pages · SEO · care |
| `commerce` | Shopify · Woo · headless · marketplace · B2B · checkout · ERP |
| `ai` | Strategy · agents · RAG · automation · LLM tools · guardrails · MCP |

Icons stay `SERVICE_ICONS` as already mapped.

**Right column — "Featured" + "Quick access":**
- A dark gradient card (radial indigo glow over a near-black gradient, per
  the reference's `.mr-feat` — this is the one deliberately dark surface
  inside an otherwise light panel, matching the reference exactly):
  label "AI & Automation · New", title "AI Agents & RAG Pipelines", body
  "Production-ready AI workflows for real teams, not just demos." →
  `/services/ai/agents-rag`.
- "Quick access" pill row: MVP Sprint (`/engagement/mvp-sprint`), AI Agents
  (`/services/ai/agents-rag`), RAG Systems (`/services/ai/llm-integrations`),
  Design Systems (`/services/design/design-systems`), Shopify Plus
  (`/services/commerce/shopify`), Team Aug (`/engagement/team-augmentation`).

**Footer bar** (full-width strip under all 3 columns, separated by a
hairline): "5 services · Full-stack digital product studio" on the left;
"View Our Work →" (`/work`) + "Explore All Services →" pill (`/services`)
on the right.

## Industries mega menu

New — Industries is currently a compact dropdown
(`SIMPLE_MENUS[0]`/`"industries"`); this becomes a mega menu with the same
3-column shell as Services.

**Left column:** identical "How We Engage" card (shared content above).

**Center column — "Industries We Serve":** a 2-column grid, icon + name +
one-liner each. Expands the current 8-industry list to the reference's 10,
renaming a few labels to match the reference exactly:

| Icon | Name | Sub | href |
|---|---|---|---|
| `cloud` | SaaS | Scalable B2B & B2C products | `/industries/saas` |
| `shopping-cart` | eCommerce & Retail | Stores that convert at scale | `/industries/ecommerce` |
| `credit-card` | FinTech | Finance built to move fast | `/industries/fintech` |
| `building-2` | Real Estate | Platforms buyers trust | `/industries/real-estate` |
| `truck` | Logistics | Ops that move without friction | `/industries/logistics` |
| `plane` | Travel & Hospitality | Experiences that book | `/industries/travel` |
| `briefcase` | Professional Services | Service firms that grow | `/industries/professional-services` |
| `gem` | Luxury & Lifestyle | Brands built to endure | `/industries/luxury` |
| `shirt` | RMG & Fashion | Supply chain to storefront | `/industries/rmg` |
| `utensils` | Restaurant & Food | Hospitality that scales | `/industries/restaurant-food` |

(Drops the old "SaaS & Technology" label in favor of "SaaS"; renames
"Travel" → "Travel & Hospitality" and "RMG" → "RMG & Fashion" to match the
reference; adds Luxury & Lifestyle and Restaurant & Food as new entries.)

**Right column — "Case Study" + "Popular verticals":**
- Same dark gradient card treatment as Services' Featured card: label
  "FinTech · Featured", body "Rebuilt a payment platform — 3× transactions
  with zero-downtime migration" → `/work` (placeholder case study, same
  status as other placeholder stats already flagged elsewhere on the site —
  not a new TODO, just carried over from the reference as-is).
- "Popular verticals" pill row: SaaS, FinTech, eCommerce, Luxury, Travel →
  their respective `/industries/*` hrefs above.

**Footer bar:** "10 industries · Built for high-growth digital teams" on the
left; "View Case Studies →" (`/work`) + "Explore All Industries →" pill
(`/industries`) on the right.

## Insights dropdown (compact — unchanged shape, content updated)

Expands from 3 items to the reference's 7, with a divider after the first 3
(matching the reference's grouping):

| Icon | Label | href |
|---|---|---|
| `file-text` | Blog | `/insights/blog` |
| `clipboard-list` | Playbooks | `/insights/playbooks` |
| `bar-chart-2` | Research & Newsletters | `/insights/research-newsletters` |
| — divider — | | |
| `video` | Webinars | `/insights/webinars` |
| `mic` | Podcasts | `/insights/podcasts` |
| `help-circle` | FAQs | `/insights/faqs` |
| `download` | Downloads | `/insights/downloads` |

## Company dropdown (compact — unchanged shape, content updated)

Expands from 4 items to the reference's 7, with a divider before the last 2:

| Icon | Label | href |
|---|---|---|
| `building-2` | About | `/company/about` |
| `users` | Leadership Team | `/company/leadership` |
| `sparkles` | Life at CodeShaper | `/company/life` |
| `handshake` | Clients & Partners | `/company/clients` |
| `map-pin` | Locations | `/company/locations` |
| — divider — | | |
| `message-circle` | Contact | `/company/contact` |
| `target` | Careers | `/company/careers` |

`SIMPLE_MENUS` needs a `dividerAfterIndex` (or equivalent) field to place
these — it doesn't support dividers today.

## New icons

`ICONS` registry (`src/lib/icons.tsx`) gains: `zap`, `user-plus`,
`clipboard-list`, `bar-chart-2`, `video`, `mic`, `help-circle`, `download`,
`cloud`, `credit-card`, `gem`, `utensils`, `map-pin`, `message-circle`,
`target`. All confirmed present in the installed `lucide-react` version.
`globe` (already registered) is reused for Global Delivery, matching the
reference's reuse of the same icon for two different rows.

## Mobile menu

Same Radix Accordion shell, restructured to match:

- Services accordion: sub-sections now labeled "How We Engage" / "Core
  Services" / "Featured" / "Quick Access" instead of one flat list of
  sub-services — mirrors the reference's `.mob-sub-lbl` grouping.
- New Industries accordion: flat list of the 10 industries + "Explore All
  Industries →".
- "Success Stories" becomes a plain top-level link (was previously absent;
  "Work" moves out of the accordion pattern).
- Insights and Company accordions get the expanded content above (no
  visual divider needed in the flat mobile list — dividers are a
  desktop-dropdown-only affordance).
- Bottom CTA row gains a second button: "View Work" (ghost) + "Book a
  Call" (solid) — currently only Book a Call.

## Visual treatment

The reference file contains **two** mega-menu CSS passes (an earlier
full-bleed-to-the-viewport-edges version, then a later "v2 polish" block
that overrides it via cascade order — confirmed by reading both blocks in
`custom.css`). The **polish pass is what actually renders** in the
reference screenshots the user shared, and is the one this round
implements:

- Floating rounded card, not full-bleed: `border-radius: 24px`, centered,
  `max-width: 1180px`, `width: min(calc(100vw - 48px), 1180px)`, sitting
  ~10px below the nav bar with a soft shadow
  (`0 24px 70px rgba(11,15,25,.12), 0 4px 14px rgba(11,15,25,.05)`) and a
  hairline border — replaces the current edge-to-edge panel.
- 3-column grid: `minmax(0,.95fr) minmax(0,1.08fr) minmax(270px,.9fr)` for
  Services, `minmax(0,.9fr) minmax(0,1.1fr) minmax(270px,.85fr)`-ish for
  Industries (reference uses slightly narrower left/wider right columns for
  Industries — carry the reference's two distinct grid-template-column
  values, don't force them identical).
- Row hover treatment (`.mega-em-row`, `.mega-svc`, `.mega-ind` in the
  reference): `rgba(102,126,234,.06)` background wash + a
  `rgba(102,126,234,.12)` border on hover, icon tile lifts 1px and darkens
  slightly, name text turns indigo. This is a different, more refined hover
  than the current `.menu-row::after` wash — replace it for these three row
  types specifically (compact-dropdown `.mdi` rows keep their existing
  hover treatment, already correct from Round 1).
- Icon tiles: 36×36px, `border-radius: 12px`, white-to-`#F7F8FB` gradient
  fill, subtle indigo border + inset highlight + soft drop shadow — a
  slightly richer treatment than the current flat `icon-tile` class.
- Featured/Case-Study cards: dark gradient
  (`radial-gradient(circle at 86% 10%, rgba(102,126,234,.2), transparent
  32%), linear-gradient(145deg, #0B0F19 0%, #171A2C 55%, #20264B 100%)`) —
  this is intentionally the one dark surface inside the light panel, exactly
  as in the reference; not a mistake to fix in a later contrast pass.
- Footer bar: light `--color-canvas-raised` background, hairline top
  border, count + description on the left, two actions on the right (a
  quiet text link + an outlined pill that fills solid on hover).
- One new color value needed: the reference's `--mid: #374151` (a tone
  between `--color-ink` and `--color-ink-dim`, used for a few dropdown/
  mobile-menu label colors) isn't in the current `.theme-light` token set —
  add `--color-ink-mid: #374151` alongside the existing ink tokens.
- `prefers-reduced-motion`: the mega panels' open/close transition
  (opacity/transform) and hover micro-interactions (icon lift, arrow
  slide, chip color) already route through the existing Tailwind
  `motion-reduce:` pattern used elsewhere in the nav — carry that forward
  for every new hover/transition rule this round adds. No canvas/WebGL
  content is involved in the nav, so this is simpler than the hero work in
  Round 1.
- Responsive: mega menus and compact dropdowns fully hide under `1024px`
  in favor of the mobile drawer (`.mega, .mdrop { display: none }` in the
  reference at `max-width: 1023px`) — this already matches how v3's
  `Nav.Root`/mobile-hamburger split works today, no new breakpoint logic
  needed beyond making sure the new Industries mega menu is included in
  whatever container currently gets hidden at that width.

## Explicitly out of scope for this round

- Hero, Trust Strip, and every section below the hero — untouched,
  continuing Round 1's section-by-section approach.
- Real destination pages for the new `/engagement/*`,
  `/industries/luxury`, `/industries/restaurant-food`, `/insights/*` (new
  ones), and `/company/*` (new ones) routes — these are nav-only links for
  now, consistent with how every other service/industry page on the site
  is currently a placeholder-routed link, not a new gap introduced by this
  round.
- The two pre-existing, out-of-scope bugs flagged during Round 1's final
  review (PromptPipeline.tsx's reduced-motion stuck state; MeshType.tsx's
  resize handling) — unrelated to the nav, not touched here.

## Files touched

`src/lib/navigation.ts` (new `ENGAGEMENT_MODELS` export, `SERVICE_COLUMNS`
gains a `tags` field, `SIMPLE_MENUS`'s `industries` entry removed in favor
of a new dedicated `INDUSTRY_COLUMNS`-shaped export, `insights` and
`company` entries' content updated, divider support added), `src/lib/
icons.tsx` (new icon registrations), `src/app/globals.css` (new mega-panel
shell CSS: floating card, 3-col grids, row hover treatment, icon tiles,
featured/case-study dark card, footer bar, `--color-ink-mid` token),
`src/components/nav/Navbar.tsx` (nav order, Home link, Industries promoted
to mega, View Work + Book a Call button pair), `src/components/nav/
MegaPanel.tsx` (rebuilt as the new Services 3-column panel),
new `src/components/nav/IndustriesMegaPanel.tsx`, `src/components/nav/
MobileMenu.tsx` (accordion restructure).
