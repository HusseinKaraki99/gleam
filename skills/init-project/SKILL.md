---
name: init-project
description: Generate a new project using the Gleam template system. Walks through an interactive questionnaire, then generates a complete monorepo with full Claude Code integration.
user-invocable: true
allowed-tools: Bash, Read, Write, Edit, Agent, AskUserQuestion, Task
argument-hint: "[preset: solo-saas | team-platform | enterprise | fullstack-mobile]"
---

# Init Project

Generate a new project using the Gleam template system.

## If a preset is specified ($ARGUMENTS)

Skip the questionnaire and use the named preset. Still ask for:
1. Project name (kebab-case)
2. Display name
3. Description
4. Organization scope (@org)
5. Target directory

Then generate immediately.

## If no preset specified

Walk through the questionnaire phase by phase using AskUserQuestion:

### Phase 1: Project Identity
- Project name (kebab-case, validated)
- Display name (Title Case)
- One-sentence description
- Organization scope (e.g., @acme)
- Target directory (default: ~/projects/<name>)

### Phase 2: Team Shape
- Solo / Small (2-5) / Team (5-20) / Large (20+)

### Phase 3: Frontend
- How many frontend apps? (1-3)
- For each: name and type (Next.js SSR or Vite SPA)

### Phase 4: Backend
- How many backend services? (1-3)
- For each: name and type (NestJS, Go, or ASP.NET Core)

### Phase 5: Mobile
- Include Expo mobile app? (yes/no)

### Phase 6: Database
- PostgreSQL / SQLite / None
- (ORM is auto-selected: Drizzle for Node, sqlc for Go, EF Core for .NET)

### Phase 7: Architecture
- Auth provider: Clerk / Auth0 / Custom / None
- Multi-tenancy: Row-level / Schema / None
- API style: REST / GraphQL / tRPC
- i18n: Enabled + locales / Disabled
- Hosting: Vercel+Fly / AWS / GCP / Self-hosted

### Phase 8: Brand & Design (if frontend selected)
- Primary brand hue: number 0-360 on the color wheel (e.g., 220=blue, 195=teal, 280=purple, 350=red)
  - Show a reference: 0=red, 30=orange, 60=yellow, 120=green, 195=teal, 220=blue, 280=purple, 330=pink
- Brand personality: Professional / Playful / Minimal / Bold
- Motion level: Full (spring animations, page transitions) / Subtle (CSS transitions only) / None
- Figma file: Do you have an existing Figma file? (optional — provide URL or skip)

### Phase 9: AI Integration Level
- Full (all agents, skills, hooks, MCP, Figma integration)
- Standard (core agents + skills + hooks) — default
- Minimal (CLAUDE.md + rules only)

### Phase 10: Confirmation
Show a summary table of all selections. Offer to match a preset if selections are close. Confirm before generating.

## Generation

Once confirmed, generate the project through the Gleam engine. **Always run the
engine — never hand-render templates.** The engine resolves the config, composes
the selected stacks, renders every template, writes the files, and runs
post-processing (git init, install, initial commit) in one step.

Build a `ProjectConfig` from the answers (shape in `config/types`; available
stacks in the stack registry). If the answers closely match a preset, use the
preset path.

### How to invoke the engine

Pick the invocation based on where Gleam is running from:

**Installed as a plugin** (the normal case — `$CLAUDE_PLUGIN_ROOT` is set). Run
the bundled, dependency-free engine. It needs no `pnpm install`:

```bash
GLEAM_TEMPLATES_DIR="$CLAUDE_PLUGIN_ROOT/templates" \
  node "$CLAUDE_PLUGIN_ROOT/dist/gleam.mjs" \
  --config '<ProjectConfig JSON>' --target <target-dir>

# Or from a preset with light overrides:
GLEAM_TEMPLATES_DIR="$CLAUDE_PLUGIN_ROOT/templates" \
  node "$CLAUDE_PLUGIN_ROOT/dist/gleam.mjs" \
  --preset solo-saas --name acme --display-name "Acme" \
  --org "@acme" --target ~/projects/acme
```

**Local development inside the Gleam repo** (`$CLAUDE_PLUGIN_ROOT` is unset and a
`package.json` named `gleam` is present). Use the source path so changes are
reflected immediately:

```bash
pnpm generate --config '<ProjectConfig JSON>' --target <target-dir>
pnpm generate --preset solo-saas --name acme --org "@acme" --target ~/projects/acme
```

Both paths run the same engine. Add `--dry-run` to preview the file manifest
without writing, or `--no-post-process` to skip git/install.

### After generating

1. If generation errors, fix the input config or the offending template and
   re-run — do not fall back to manual rendering. A missing template or an
   unsupported stack is a real gap to surface, not to work around.

2. Report what was generated:
   - Number of files created (printed by the command)
   - Apps and services scaffolded
   - Claude Code artifacts included (agents, skills, hooks, rules)
   - Suggested next steps (run /start-session in the new project)
