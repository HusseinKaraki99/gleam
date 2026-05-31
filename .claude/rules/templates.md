---
globs: templates/**/*.hbs
---

# Template editing rules

## Readability first
- Templates must look like their output. A developer should understand the generated file by reading the `.hbs` file.
- Use Handlebars block helpers (`{{#if}}`, `{{#each}}`) sparingly. Max 2 levels of nesting.
- Prefer separate template files over deeply conditional single files.

## Naming
- Template files: `<output-filename>.hbs` (e.g., `package.json.hbs`, `CLAUDE.md.hbs`)
- Template directories mirror the generated output structure.

## Variables
- Use `{{camelCase}}` for inline values: `{{projectName}}`, `{{org}}`
- Use `{{#if feature}}` for conditional sections, not inline ternaries
- Use `{{#each items}}` for lists, with `{{this.name}}` for item properties

## Helpers available
- `kebabCase`, `pascalCase`, `camelCase` — naming transforms
- `ifStack` — check if a specific stack is selected
- `eachApp` — iterate over frontend apps
- `eachService` — iterate over backend services

## Testing
- Every template must have a snapshot test in `tests/snapshots/`
- After editing a template, run `pnpm test` to verify snapshots
