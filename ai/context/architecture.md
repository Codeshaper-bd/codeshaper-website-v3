# Architecture

## Two repositories

| Repo | Path | Stack | Role |
|---|---|---|---|
| **Website** (this one) | `codeshaper-website-v3` | Next.js 15 App Router, React 19, Tailwind CSS v4, TypeScript | the public site |
| **CMS** | `../codeshaper-cms` | Laravel 13, Filament 5, MySQL, Docker | content, leads, settings; run everything through `./dc <cmd>` |

## How content flows

```
CMS (edit, Publish) ──"Update website"──▶ /api/cms/publish ─▶ scripts/publish.mjs
                                         └▶ scripts/sync-content.mjs + scripts/cms/transform.mjs
                                             ─▶ src/content/*.json + public/cms/* (pictures)
Website reads src/content/*.json at build/dev time.
Forms (contact, booking) ─▶ /api/contact ─▶ CMS › Leads
```

- Homepage words: `src/lib/home-defaults.json` (originals) + CMS overrides via `homeCopy(key, copy)`. The CMS keeps an identical copy at `resources/data/home-original.json`.
- Homepage sections: `src/components/home/HomeView.tsx` renders the CMS order; below-the-fold sections load through `src/components/system/LazySection.tsx`.
- CMS homepage editor: `app/Support/Home.php` (section list + order), `app/Filament/Cms/HomeEditor.php` (fields). New homepage section = defaults JSON (both repos) + `Home::BUILT_IN` + editor fields + `HOME_BUILT_IN` in `transform.mjs` + `HomeView`/`LazySection` + a migration.

## Folder map (website)

```
src/app/                 routes (homepage: page.tsx)
src/components/home/     homepage composition (HomeView, HomeBlock)
src/components/sections/ one file per section
src/components/system/   shared primitives (SectionHeading, Reveal, LazySection…)
src/content/             CMS output (generated, do not hand-edit except in emergencies)
src/lib/                 data access, homeCopy, defaults
scripts/                 content sync, publish, ai tools (scripts/ai/)
ai/                      AI setup: context, rules, knowledge, agents, skills, prompts
```
