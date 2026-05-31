import type { ResolvedConfig } from '../config/types.js';
import type { StackDefinition, TemplateFile, ClaudeArtifact, CiStep } from '../stacks/types.js';
import { getStack } from '../stacks/registry.js';

export interface ComposedProject {
  templates: ResolvedTemplate[];
  claudeArtifacts: ClaudeArtifact[];
  ciSteps: CiStep[];
  stacks: StackDefinition[];
  scripts: Record<string, string>;
}

export interface ResolvedTemplate {
  templatePath: string;
  outputPath: string;
  context: Record<string, unknown>;
}

export function compose(config: ResolvedConfig): ComposedProject {
  const stacks: StackDefinition[] = [];
  const templates: ResolvedTemplate[] = [];
  const claudeArtifacts: ClaudeArtifact[] = [];
  const ciSteps: CiStep[] = [];
  const scripts: Record<string, string> = {};
  const seenArtifactPaths = new Set<string>();

  addRootTemplates(config, templates);

  for (const app of config.frontend.apps) {
    const stack = getStack(app.type);
    stacks.push(stack);

    for (const tmpl of stack.templates) {
      templates.push(resolveTemplate(tmpl, { name: app.name }, config));
    }

    addUniqueArtifacts(filterArtifacts(stack.claudeArtifacts, config), claudeArtifacts, seenArtifactPaths);
    addUniqueCiSteps(stack.ciSteps, ciSteps);
    Object.assign(scripts, stack.scripts ?? {});
  }

  for (const service of config.backend.services) {
    const stack = getStack(service.type);
    stacks.push(stack);

    for (const tmpl of stack.templates) {
      templates.push(resolveTemplate(tmpl, { name: service.name }, config));
    }

    addUniqueArtifacts(filterArtifacts(stack.claudeArtifacts, config), claudeArtifacts, seenArtifactPaths);
    addUniqueCiSteps(stack.ciSteps, ciSteps);
    Object.assign(scripts, stack.scripts ?? {});

    const orm = config.ormPerService.get(service.name);
    if (orm && orm !== 'none') {
      const ormStack = getStack(orm);
      if (!stacks.some((s) => s.id === ormStack.id)) {
        stacks.push(ormStack);

        for (const tmpl of ormStack.templates) {
          templates.push(resolveTemplate(tmpl, {}, config));
        }

        addUniqueArtifacts(filterArtifacts(ormStack.claudeArtifacts, config), claudeArtifacts, seenArtifactPaths);
        addUniqueCiSteps(ormStack.ciSteps, ciSteps);
        Object.assign(scripts, ormStack.scripts ?? {});
      }
    }
  }

  if (config.mobile.enabled && config.mobile.type !== 'none') {
    const stack = getStack(config.mobile.type);
    stacks.push(stack);

    for (const tmpl of stack.templates) {
      templates.push(resolveTemplate(tmpl, { name: 'mobile' }, config));
    }

    addUniqueArtifacts(filterArtifacts(stack.claudeArtifacts, config), claudeArtifacts, seenArtifactPaths);
    addUniqueCiSteps(stack.ciSteps, ciSteps);
    Object.assign(scripts, stack.scripts ?? {});
  }

  addClaudeBaseArtifacts(config, claudeArtifacts, seenArtifactPaths);

  return { templates, claudeArtifacts, ciSteps, stacks, scripts };
}

function addRootTemplates(config: ResolvedConfig, templates: ResolvedTemplate[]): void {
  const rootTemplates: TemplateFile[] = [
    { templatePath: 'root/package.json.hbs', outputPath: 'package.json' },
    { templatePath: 'root/pnpm-workspace.yaml.hbs', outputPath: 'pnpm-workspace.yaml' },
    { templatePath: 'root/nx.json.hbs', outputPath: 'nx.json' },
    { templatePath: 'root/tsconfig.base.json.hbs', outputPath: 'tsconfig.base.json' },
    { templatePath: 'root/biome.json.hbs', outputPath: 'biome.json' },
    { templatePath: 'root/.gitignore.hbs', outputPath: '.gitignore' },
    { templatePath: 'root/.tool-versions.hbs', outputPath: '.tool-versions' },
    { templatePath: 'root/.env.example.hbs', outputPath: '.env.example' },
    { templatePath: 'root/.editorconfig.hbs', outputPath: '.editorconfig' },
    { templatePath: 'root/.npmrc.hbs', outputPath: '.npmrc' },
    { templatePath: 'root/CLAUDE.md.hbs', outputPath: 'CLAUDE.md' },
    { templatePath: 'root/.mcp.json.hbs', outputPath: '.mcp.json' },
    { templatePath: 'root/SESSION_LOG.md.hbs', outputPath: 'SESSION_LOG.md' },
    { templatePath: 'root/NEXT_STEPS.md.hbs', outputPath: 'NEXT_STEPS.md' },
    { templatePath: 'root/PROJECT_STATUS.md.hbs', outputPath: 'PROJECT_STATUS.md' },
    { templatePath: 'docs/product/PRD.md.hbs', outputPath: 'docs/product/PRD.md' },
    { templatePath: 'docs/specs/_TEMPLATE.md.hbs', outputPath: 'docs/specs/_TEMPLATE.md' },
    { templatePath: 'docs/research/_TEMPLATE.md.hbs', outputPath: 'docs/research/_TEMPLATE.md' },
  ];

  if (config.needsGoWork) {
    rootTemplates.push(
      { templatePath: 'root/go.work.hbs', outputPath: 'go.work' },
      { templatePath: 'root/.golangci.yml.hbs', outputPath: '.golangci.yml' },
      { templatePath: 'root/Makefile.hbs', outputPath: 'Makefile' },
    );
  }

  if (config.hasFrontend) {
    rootTemplates.push(
      { templatePath: 'packages/design-tokens/package.json.hbs', outputPath: 'packages/design-tokens/package.json' },
      { templatePath: 'packages/design-tokens/tokens.css.hbs', outputPath: 'packages/design-tokens/tokens.css' },
      { templatePath: 'packages/design-tokens/motion.ts.hbs', outputPath: 'packages/design-tokens/motion.ts' },
      { templatePath: 'packages/design-tokens/index.ts.hbs', outputPath: 'packages/design-tokens/index.ts' },
      { templatePath: 'packages/ui/package.json.hbs', outputPath: 'packages/ui/package.json' },
      { templatePath: 'packages/ui/src/primitives/cn.ts.hbs', outputPath: 'packages/ui/src/primitives/cn.ts' },
      { templatePath: 'packages/ui/src/primitives/motion-config.ts.hbs', outputPath: 'packages/ui/src/primitives/motion-config.ts' },
      { templatePath: 'packages/ui/src/component-meta.ts.hbs', outputPath: 'packages/ui/src/component-meta.ts' },
      { templatePath: 'packages/types/src/index.ts.hbs', outputPath: 'packages/types/src/index.ts' },
      { templatePath: 'packages/ui/src/button/button.tsx.hbs', outputPath: 'packages/ui/src/button/button.tsx' },
      { templatePath: 'packages/ui/src/button/index.ts.hbs', outputPath: 'packages/ui/src/button/index.ts' },
      { templatePath: 'packages/ui/src/card/card.tsx.hbs', outputPath: 'packages/ui/src/card/card.tsx' },
      { templatePath: 'packages/ui/src/card/index.ts.hbs', outputPath: 'packages/ui/src/card/index.ts' },
      { templatePath: 'packages/ui/src/input/input.tsx.hbs', outputPath: 'packages/ui/src/input/input.tsx' },
      { templatePath: 'packages/ui/src/input/index.ts.hbs', outputPath: 'packages/ui/src/input/index.ts' },
      { templatePath: 'packages/ui/src/badge/badge.tsx.hbs', outputPath: 'packages/ui/src/badge/badge.tsx' },
      { templatePath: 'packages/ui/src/badge/index.ts.hbs', outputPath: 'packages/ui/src/badge/index.ts' },
      { templatePath: 'packages/ui/src/index.ts.hbs', outputPath: 'packages/ui/src/index.ts' },
      { templatePath: 'packages/ui/code-connect.ts.hbs', outputPath: 'packages/ui/code-connect.ts' },
    );
  }

  if (config.needsDocker) {
    rootTemplates.push(
      { templatePath: 'infra/docker/docker-compose.yml.hbs', outputPath: 'infra/docker/docker-compose.yml' },
    );
  }

  rootTemplates.push(
    { templatePath: 'docs/adr/0001-initial-architecture.md.hbs', outputPath: 'docs/adr/0001-initial-architecture.md' },
    { templatePath: 'docs/README.md.hbs', outputPath: 'docs/README.md' },
  );

  rootTemplates.push(
    { templatePath: 'infra/github-actions/ci.yml.hbs', outputPath: '.github/workflows/ci.yml' },
  );

  for (const tmpl of rootTemplates) {
    templates.push(resolveTemplate(tmpl, {}, config));
  }
}

function addClaudeBaseArtifacts(
  config: ResolvedConfig,
  artifacts: ClaudeArtifact[],
  seen: Set<string>,
): void {
  const baseArtifacts: ClaudeArtifact[] = [
    { type: 'agent', templatePath: 'claude/agents/architect.md.hbs', outputPath: '.claude/agents/architect.md' },
    { type: 'agent', templatePath: 'claude/agents/code-reviewer.md.hbs', outputPath: '.claude/agents/code-reviewer.md' },
    { type: 'agent', templatePath: 'claude/agents/security-auditor.md.hbs', outputPath: '.claude/agents/security-auditor.md' },
    { type: 'agent', templatePath: 'claude/agents/test-writer.md.hbs', outputPath: '.claude/agents/test-writer.md' },
    { type: 'agent', templatePath: 'claude/agents/performance-analyst.md.hbs', outputPath: '.claude/agents/performance-analyst.md' },
    { type: 'agent', templatePath: 'claude/agents/refactoring-specialist.md.hbs', outputPath: '.claude/agents/refactoring-specialist.md' },
    { type: 'rule', templatePath: 'claude/rules/testing.md.hbs', outputPath: '.claude/rules/testing.md' },
    { type: 'skill', templatePath: 'claude/skills/start-session/SKILL.md.hbs', outputPath: '.claude/skills/start-session/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/self-review/SKILL.md.hbs', outputPath: '.claude/skills/self-review/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/commit/SKILL.md.hbs', outputPath: '.claude/skills/commit/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/local-setup/SKILL.md.hbs', outputPath: '.claude/skills/local-setup/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/sync-docs/SKILL.md.hbs', outputPath: '.claude/skills/sync-docs/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/new-feature/SKILL.md.hbs', outputPath: '.claude/skills/new-feature/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/deploy/SKILL.md.hbs', outputPath: '.claude/skills/deploy/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/adr/SKILL.md.hbs', outputPath: '.claude/skills/adr/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/plan-review/SKILL.md.hbs', outputPath: '.claude/skills/plan-review/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/discover/SKILL.md.hbs', outputPath: '.claude/skills/discover/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/research/SKILL.md.hbs', outputPath: '.claude/skills/research/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/spec/SKILL.md.hbs', outputPath: '.claude/skills/spec/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/plan-feature/SKILL.md.hbs', outputPath: '.claude/skills/plan-feature/SKILL.md' },
    { type: 'skill', templatePath: 'claude/skills/iterate/SKILL.md.hbs', outputPath: '.claude/skills/iterate/SKILL.md' },
    { type: 'agent', templatePath: 'claude/agents/phase-gate.md.hbs', outputPath: '.claude/agents/phase-gate.md' },
    { type: 'agent', templatePath: 'claude/agents/product-analyst.md.hbs', outputPath: '.claude/agents/product-analyst.md' },
    { type: 'hook', templatePath: 'claude/hooks/format-on-edit.cjs.hbs', outputPath: '.claude/hooks/format-on-edit.cjs' },
    { type: 'hook', templatePath: 'claude/hooks/block-dangerous-bash.cjs.hbs', outputPath: '.claude/hooks/block-dangerous-bash.cjs' },
    { type: 'hook', templatePath: 'claude/hooks/session-context.cjs.hbs', outputPath: '.claude/hooks/session-context.cjs' },
    { type: 'hook', templatePath: 'claude/hooks/capture-feedback.cjs.hbs', outputPath: '.claude/hooks/capture-feedback.cjs' },
    { type: 'skill', templatePath: 'claude/skills/feedback-review/SKILL.md.hbs', outputPath: '.claude/skills/feedback-review/SKILL.md' },
    { type: 'hook', templatePath: 'claude/feedback/README.md.hbs', outputPath: '.claude/feedback/README.md' },
    { type: 'hook', templatePath: 'claude/settings.json.hbs', outputPath: '.claude/settings.json' },
    { type: 'hook', templatePath: 'claude/welcome-message.md.hbs', outputPath: '.claude/welcome-message.md' },
    { type: 'hook', templatePath: 'claude/hints.txt.hbs', outputPath: '.claude/hints.txt' },
    { type: 'hook', templatePath: 'claude/README.md.hbs', outputPath: '.claude/README.md' },
  ];

  if (config.hasFrontend) {
    baseArtifacts.push(
      { type: 'rule', templatePath: 'claude/rules/design-system.md.hbs', outputPath: '.claude/rules/design-system.md' },
      { type: 'agent', templatePath: 'claude/agents/design-reviewer.md.hbs', outputPath: '.claude/agents/design-reviewer.md' },
      { type: 'skill', templatePath: 'claude/skills/design-review/SKILL.md.hbs', outputPath: '.claude/skills/design-review/SKILL.md' },
      { type: 'skill', templatePath: 'claude/skills/figma-sync/SKILL.md.hbs', outputPath: '.claude/skills/figma-sync/SKILL.md' },
      { type: 'skill', templatePath: 'claude/skills/figma-implement/SKILL.md.hbs', outputPath: '.claude/skills/figma-implement/SKILL.md' },
    );
  }

  if (config.aiLevel === 'minimal') {
    const minimalTypes = new Set(['rule']);
    for (const artifact of baseArtifacts.filter((a) => minimalTypes.has(a.type))) {
      addUniqueArtifacts([artifact], artifacts, seen);
    }
    return;
  }

  if (config.aiLevel === 'standard') {
    const standardTypes = new Set(['rule', 'agent', 'skill', 'hook']);
    for (const artifact of baseArtifacts.filter((a) => standardTypes.has(a.type))) {
      addUniqueArtifacts([artifact], artifacts, seen);
    }
    return;
  }

  addUniqueArtifacts(baseArtifacts, artifacts, seen);
}

function filterArtifacts(artifacts: ClaudeArtifact[], config: ResolvedConfig): ClaudeArtifact[] {
  if (config.aiLevel === 'full' || config.aiLevel === 'standard') {
    return artifacts;
  }
  // minimal: only rules
  return artifacts.filter((a) => a.type === 'rule');
}

function resolveTemplate(
  tmpl: TemplateFile,
  localContext: Record<string, unknown>,
  config: ResolvedConfig,
): ResolvedTemplate {
  let outputPath = tmpl.outputPath;
  for (const [key, value] of Object.entries(localContext)) {
    if (typeof value === 'string') {
      outputPath = outputPath.replaceAll(`{{${key}}}`, value);
    }
  }

  return {
    templatePath: tmpl.templatePath,
    outputPath,
    context: { ...localContext, config },
  };
}

function addUniqueArtifacts(
  newArtifacts: ClaudeArtifact[],
  existing: ClaudeArtifact[],
  seen: Set<string>,
): void {
  for (const artifact of newArtifacts) {
    if (!seen.has(artifact.outputPath)) {
      seen.add(artifact.outputPath);
      existing.push(artifact);
    }
  }
}

function addUniqueCiSteps(newSteps: CiStep[], existing: CiStep[]): void {
  const existingNames = new Set(existing.map((s) => s.name));
  for (const step of newSteps) {
    if (!existingNames.has(step.name)) {
      existingNames.add(step.name);
      existing.push(step);
    }
  }
}
