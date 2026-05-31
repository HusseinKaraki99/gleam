---
globs: src/**/*.ts
---

# Generator TypeScript rules

## Architecture
- `src/config/` — ProjectConfig type, questionnaire, presets. Pure data, no side effects.
- `src/stacks/` — Stack declarations. Each stack is a self-contained module. No cross-imports between stacks.
- `src/generator/` — Composer, renderer, writer. Orchestration logic.

## Stack modules (`src/stacks/*.ts`)
Each stack module exports a `StackDefinition` with:
- `name` — unique identifier
- `dependencies` — npm/go/nuget packages to install
- `templates` — list of template fragment paths to include
- `configContributions` — partial configs to merge into root files (nx.json, tsconfig, etc.)
- `claudeArtifacts` — rules, agents, skills, hooks to include
- `ciSteps` — CI/CD workflow steps

## Code style
- Prefer `interface` over `type` for object shapes
- Use discriminated unions for variant types
- Export types from the file that defines them
- One concern per file, barrel exports at directory level (`index.ts`)

## Error handling
- Fail fast with descriptive errors during generation
- Validate ProjectConfig before generation starts
- Never silently skip a template — if a required file can't be rendered, throw

## Testing
- Unit test each stack module's output
- Unit test the composer's merge logic
- Snapshot test rendered templates against golden outputs
