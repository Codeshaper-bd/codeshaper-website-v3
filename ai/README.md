# ai/: the AI workspace

Everything an AI assistant (or a new teammate) needs to work on this project, written **once**, tool-agnostic. Tool-specific folders (`.claude/`, `.cursor/`, `.github/`, `GEMINI.md`) only point here.

```
AGENTS.md                ← entry point every tool reads (project brief, commands, the map below)
ai/
├─ README.md             ← this file
├─ context/              ← what is true about the project (shared by all agents)
│  ├─ project.md         business, buyers, goals, figures, known gaps
│  ├─ architecture.md    two repos, content flow, folder map, "new section" checklist
│  └─ decisions.md       the owner's standing decisions, dated (they win)
├─ rules/                ← always-on rules, one file per domain
│  ├─ global.md          every agent, every task
│  ├─ design.md          UI, styling, layout, copy
│  ├─ development.md     code (website + CMS)
│  └─ devops.md          build, deploy, servers (stub until the VPS launch)
├─ knowledge/            ← reference handbooks, one folder per domain
│  ├─ design/            Codeshaper Design Handbook (11 chapters; ch. 09 is the QA checklist)
│  ├─ development/       (to come)
│  └─ devops/            (to come)
├─ agents/               ← roles: who does the work (front matter + Markdown)
│  ├─ ui-designer.md
│  ├─ design-reviewer.md
│  └─ _template.md
├─ skills/               ← workflows: how a job is done, step by step
│  ├─ design-section.md
│  ├─ design-review.md
│  └─ _template.md
├─ prompts/              ← copy-paste prompts for chat AIs (ChatGPT, Gemini, Claude.ai)
│  └─ design-coach.md
└─ plans/                ← plans and specs for bigger pieces of work (dated)

scripts/ai/              ← tools agents run (screenshot.mjs)
```

## How the layers fit

| Layer | Answers | Changes how often |
|---|---|---|
| **context** | What is true? | when the business or architecture changes |
| **rules** | What must always hold? | rarely; every rule should be testable |
| **knowledge** | How do we do it well? | grows over time |
| **agents** | Who does it? | when a new role is needed |
| **skills** | What are the steps? | when a workflow improves |
| **prompts** | How do I brief a chat AI? | as needed |

A design agent loads: `AGENTS.md` → `context/decisions.md` → `rules/global.md` → `rules/design.md` → relevant `context/*` → the skill it follows → the Design Handbook chapters (always chapter 11 for tokens/global CSS). Other domains follow the domain-specific loading order in `AGENTS.md`.

## Using it from each tool

| Tool | How it finds this |
|---|---|
| **Claude Code** | `CLAUDE.md` imports `AGENTS.md`; subagents in `.claude/agents/`, skills in `.claude/skills/` (thin wrappers → `ai/`) |
| **Codex CLI / Codex cloud** | reads `AGENTS.md` automatically |
| **Cursor** | `.cursor/rules/*.mdc` (point to `ai/rules/…`); also reads `AGENTS.md` |
| **Gemini CLI** | `GEMINI.md` → `AGENTS.md` |
| **GitHub Copilot** | `.github/copilot-instructions.md` → `AGENTS.md` |
| **ChatGPT / Gemini web / Claude.ai** | paste a file from `ai/prompts/`, upload `ai/knowledge/<domain>/` + `ai/context/` as project files |

## Adding to it

- **New agent:** copy `agents/_template.md` → fill in → (Claude) add `.claude/agents/<name>.md` wrapper → list it below.
- **New skill:** copy `skills/_template.md` → fill in → (Claude) add `.claude/skills/<name>/SKILL.md` wrapper → list it below.
- **New domain** (e.g. `seo`, `content`, `qa`): add `rules/<domain>.md`, `knowledge/<domain>/README.md`, then its agents and skills.
- **New owner decision:** one dated line in `context/decisions.md`.

## Registry

| Agent | Domain | Skills | Edits code |
|---|---|---|---|
| `ui-designer` | design | `design-section` | yes |
| `design-reviewer` | design | `design-review` | no |
