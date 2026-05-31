# CLAUDE.md — Gleam constitution

This file is read by Claude Code on every session. It defines what's always true about this codebase. Domain-specific rules load on demand from `.claude/rules/` based on what you're editing.

If you're unsure whether something is allowed, **stop and ask**.

---

## Project context

**Gleam** is a meta-template system that generates production-ready monorepo projects pre-configured for Claude Code and AI-agent-driven development. It codifies proven patterns from real production monorepos into a reusable generator. The system is accessed via a `/init-project` Claude Code skill — no standalone CLI.

---

## Tech stack

| Layer | Tool |
|---|---|
| Language | TypeScript 5.7+ (strict, ES2024, NodeNext) |
| Runtime | Node.js 22+ |
| Template engine | Handlebars |
| Package manager | pnpm 9+ |
| Testing | Vitest |
| Linting | Biome (when added) |

---

## Where the rules live

| When editing... | Auto-loads |
|---|---|
| `templates/**/*.hbs` | `.claude/rules/templates.md` |
| `src/**/*.ts` | `.claude/rules/generator.md` |

---

## Always-true rules (cross-cutting)

### File / function size
- Max **250 lines** per `.ts` file.
- Max **50 lines** per function, **5 parameters**.
- Cyclomatic complexity <= 10. Max nesting depth 3.

### No god files
- No `utils.ts`, `helpers.ts`, `common.ts`. Use specific names.
- More than 5 exported symbols per file = probably split.

### Template readability
- `.hbs` template files must look nearly identical to their rendered output. A developer should be able to read a `.hbs` file and understand the generated output without knowing Handlebars.
- Complex composition logic belongs in TypeScript (composer/stacks), not in template conditionals. Templates should have minimal `{{#if}}` nesting (max 2 levels).
- Every template fragment must have a corresponding snapshot test.

### Stack modules
- Each stack (`src/stacks/*.ts`) declares its own dependencies, files, config contributions, and Claude Code artifacts.
- Stacks are composable — the composer merges them. No stack should assume another stack is present.
- Stack modules must not import from each other.

### Module boundaries
- `src/config/` — types and questionnaire logic. No template rendering.
- `src/stacks/` — stack declarations. No generator logic.
- `src/generator/` — composer, renderer, writer. Reads stacks, produces files.
- `templates/` — Handlebars templates only. No TypeScript.

### Tests
- No production code without tests. Every new stack module, generator function, and template must be tested.
- Snapshot tests for template output. Unit tests for logic.

### Commits
Conventional Commits, squash merge to `main`.

---

## Workflow rules

### When adding a new stack
1. Create the stack module in `src/stacks/<name>.ts`
2. Register it in `src/stacks/registry.ts`
3. Create template fragments in `templates/`
4. Add Claude Code artifacts (rules, agents, skills) in `templates/claude/`
5. Add snapshot tests
6. Update presets if the stack fits common project shapes

### When editing templates
- Render the template mentally first — will the output be valid?
- Check that Handlebars helpers used are registered in the renderer
- Run snapshot tests to verify output didn't drift

### When adding Claude Code artifacts (agents, skills, hooks, rules)
- Base them on the proven patterns established in this repo's rules and existing artifacts
- Parameterize with Handlebars where the content depends on stack selection
- Keep static where the content is universal

---

## Token-efficiency rules

1. Use `Grep` before `Read` when searching.
2. Use `Explore` sub-agent for multi-file research.
3. Mark tasks completed promptly.
4. Don't echo large diffs — describe what changed in 2-3 lines.

---

## Design heritage (adapt these patterns)

Gleam's conventions are distilled from production monorepos:

- **Backend (Go):** hexagonal architecture, strict module boundaries, path-scoped rules, the CLAUDE.md constitution format.
- **Claude Code integration:** self-review skills; format-on-edit, block-dangerous-bash, and session-context hooks; a standing agent roster; a tuned `settings.json`.
- **Frontend monorepo:** barrel exports, path aliases, TanStack Query patterns, Nx structure.

---

## Forbidden actions

- Adding a standalone CLI binary (the interface is Claude Code skills only)
- Complex Handlebars logic (more than 2 levels of `{{#if}}` nesting)
- Stack modules importing from each other
- Templates containing TypeScript logic
- Generating files without snapshot test coverage
