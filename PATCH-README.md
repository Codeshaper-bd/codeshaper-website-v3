# Codeshaper Design Foundation patch

This archive contains only files changed or added for the Foundation First pass. Paths are relative to the project root.

## Apply safely
1. Back up your current project (or create a Git branch).
2. Extract this archive.
3. Copy/merge the included paths into the existing project, preserving all other files.
4. Install dependencies using the project's package manager, then run `npx tsc --noEmit -p .` and the normal build.
5. Review the known Case Studies background discrepancy before the separate homepage implementation phase.

No homepage section component was redesigned in this patch. `src/app/globals.css` only receives semantic token definitions and an explanatory theme-scope comment; legacy utilities remain supported.
