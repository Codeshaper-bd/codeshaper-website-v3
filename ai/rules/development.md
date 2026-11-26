# Development rules (always on for code changes)

> Starter rules from how the project works today. Extend this file as the development agent grows; keep it short and testable.

1. **TypeScript strict, no `any`** unless at a boundary with a comment. `npx tsc --noEmit -p .` must pass.
2. **Server components by default;** `"use client"` only for interaction or browser APIs. Below-the-fold homepage sections load via `LazySection`.
3. **Content is data:** pages read `src/content/*.json` through `src/lib/*`; never hard-code CMS-managed content. New homepage section → follow the checklist in `ai/context/architecture.md`.
4. **Keep the two repos in sync:** `src/lib/home-defaults.json` ≡ CMS `resources/data/home-original.json`; transform changes in `scripts/cms/transform.mjs` match CMS field names.
5. **CMS (Laravel):** run through Docker (`./dc …`), format with `./dc vendor/bin/pint -q`, test with `./dc php artisan test`, migrations are additive and preserve the owner's edits.
6. **Match the file's style** (existing line width ≈ 140, comments explain *why*). Don't reformat files you don't change.
7. **Security:** validate input at API routes, honeypot on forms, never log personal data, never expose secrets to the client.
8. **Performance:** images via `next/image` with honest `sizes`; no new heavy dependencies without a reason.
9. **Checks:** website `pnpm check`; CMS `./dc php artisan test`, plus the MySQL tests (CMS README) when locks, races, dates or SQL change.
10. **JSON-LD only through `components/system/JsonLd.tsx`.** Never put a visitor's words in a URL. A new website–CMS operation gets its own secret and its own rate limit (`../codeshaper-cms/deploy/credentials.md`).
11. **Shell editing pitfall (Windows):** backslashes in regexes get lost when edited through shell one-liners; use the editor tool for code with `\s`, `\d`, `\/`.
