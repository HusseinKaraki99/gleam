# Gleam

**The AI-native monorepo generator for Claude Code.** Gleam scaffolds
production-ready monorepos that come pre-wired for agent-driven development —
CLAUDE.md constitution, path-scoped rules, agents, skills, hooks, and a feedback
learning loop, all composed from the stacks you actually pick.

Gleam is a **Claude Code plugin**, not a CLI. You install it once, then run
`/init-project` from anywhere.

---

## Install

In Claude Code:

```text
/plugin marketplace add HusseinKaraki99/gleam
/plugin install gleam
```

That's it — no `npm install`, no global binary. The plugin ships a single
dependency-free engine (`dist/gleam.mjs`) and all templates. Restart Claude Code
if the `/init-project` skill doesn't appear immediately.

> Installing from a local clone instead? Point the marketplace at the path:
> `/plugin marketplace add /path/to/gleam`

## Use

```text
/init-project
```

Claude walks you through a questionnaire (team shape, frontend/backend stacks,
database, auth, brand, AI-integration level) and then generates the project. Or
skip straight to a preset:

```text
/init-project solo-saas
```

Presets: `solo-saas`, `team-platform`, `enterprise`, `fullstack-mobile`.

When generation finishes you get a complete monorepo — apps, services, CI,
infra, and the full `.claude/` toolkit — with git initialized and an initial
commit. Open it and run `/start-session`.

---

## How it works

The engine resolves your answers into a `ProjectConfig`, composes the selected
stack modules (each declares its own dependencies, files, config contributions,
and Claude Code artifacts), renders every Handlebars template, and writes the
result. The same tested engine drives the questionnaire, presets, and CI — there
is no hand-rendering path.

The engine reads templates relative to its own location (or
`GLEAM_TEMPLATES_DIR`), so it runs correctly from any working directory.

## Local development

Working on Gleam itself:

```bash
pnpm install
pnpm test              # vitest: unit + snapshot + distribution smoke tests
pnpm typecheck

# Generate from source (reflects local changes immediately):
pnpm generate --preset solo-saas --name acme --org "@acme" --target ../acme
pnpm generate --config '<ProjectConfig JSON>' --target ../acme
# Add --dry-run to preview the file manifest, --no-post-process to skip git/install.

# Rebuild the shipped single-file engine:
pnpm build:bundle      # -> dist/gleam.mjs
```

The `/init-project` skill is the same file in both worlds: it lives at
`skills/init-project/SKILL.md` and is symlinked into `.claude/skills/` for local
dev. It detects `$CLAUDE_PLUGIN_ROOT` to choose between the bundled engine
(installed plugin) and `pnpm generate` (this repo).

### Publishing a new version

1. Bump `version` in `.claude-plugin/plugin.json` and `package.json`.
2. `pnpm test && pnpm build:bundle` (the bundle at `dist/gleam.mjs` is committed
   so plugin installs are build-free).
3. Commit and push. Installs track the repo.
