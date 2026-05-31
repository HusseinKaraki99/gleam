import { describe, it, expect } from 'vitest';
import { compose } from '../../src/generator/composer.js';
import { resolveConfig } from '../../src/config/types.js';
import { soloSaasPreset } from '../../src/config/presets/solo-saas.js';
import { teamPlatformPreset } from '../../src/config/presets/team-platform.js';
import { enterprisePreset } from '../../src/config/presets/enterprise.js';

describe('composer', () => {
  it('composes solo SaaS project', () => {
    const config = resolveConfig(soloSaasPreset({}));
    const project = compose(config);

    expect(project.stacks.length).toBeGreaterThanOrEqual(3);

    const outputPaths = project.templates.map((t) => t.outputPath);
    expect(outputPaths).toContain('package.json');
    expect(outputPaths).toContain('nx.json');
    expect(outputPaths).toContain('CLAUDE.md');
    expect(outputPaths.some((p) => p.startsWith('apps/web/'))).toBe(true);
    expect(outputPaths.some((p) => p.startsWith('apps/api/'))).toBe(true);
    expect(outputPaths.some((p) => p.startsWith('db/'))).toBe(true);
  });

  it('includes Claude Code artifacts', () => {
    const config = resolveConfig(soloSaasPreset({}));
    const project = compose(config);

    const artifactPaths = project.claudeArtifacts.map((a) => a.outputPath);
    expect(artifactPaths).toContain('.claude/agents/architect.md');
    expect(artifactPaths).toContain('.claude/agents/code-reviewer.md');
    expect(artifactPaths).toContain('.claude/skills/self-review/SKILL.md');
    expect(artifactPaths).toContain('.claude/hooks/format-on-edit.cjs');
    expect(artifactPaths).toContain('.claude/hooks/block-dangerous-bash.cjs');
    expect(artifactPaths).toContain('.claude/settings.json');
  });

  it('deduplicates Claude artifacts', () => {
    const config = resolveConfig(teamPlatformPreset({}));
    const project = compose(config);

    const artifactPaths = project.claudeArtifacts.map((a) => a.outputPath);
    const uniquePaths = new Set(artifactPaths);
    expect(artifactPaths.length).toBe(uniquePaths.size);
  });

  it('adds Go-specific files for Go projects', () => {
    const config = resolveConfig(teamPlatformPreset({}));
    const project = compose(config);

    const outputPaths = project.templates.map((t) => t.outputPath);
    expect(outputPaths).toContain('go.work');
    expect(outputPaths).toContain('.golangci.yml');
    expect(outputPaths).toContain('Makefile');

    const artifactPaths = project.claudeArtifacts.map((a) => a.outputPath);
    expect(artifactPaths).toContain('.claude/rules/backend-go.md');
  });

  it('adds Docker for multi-service projects', () => {
    const config = resolveConfig(teamPlatformPreset({}));
    const project = compose(config);

    const outputPaths = project.templates.map((t) => t.outputPath);
    expect(outputPaths).toContain('infra/docker/docker-compose.yml');
  });

  it('composes enterprise polyglot project', () => {
    const config = resolveConfig(enterprisePreset({}));
    const project = compose(config);

    const outputPaths = project.templates.map((t) => t.outputPath);
    expect(outputPaths.some((p) => p.startsWith('apps/web/'))).toBe(true);
    expect(outputPaths.some((p) => p.startsWith('apps/admin/'))).toBe(true);
    expect(outputPaths.some((p) => p.startsWith('apps/marketing/'))).toBe(true);
    expect(outputPaths.some((p) => p.startsWith('services/api/'))).toBe(true);
    expect(outputPaths.some((p) => p.startsWith('services/worker/'))).toBe(true);
    expect(outputPaths.some((p) => p.startsWith('apps/notifications/'))).toBe(true);
    expect(outputPaths.some((p) => p.startsWith('apps/mobile/'))).toBe(true);

    const artifactPaths = project.claudeArtifacts.map((a) => a.outputPath);
    expect(artifactPaths).toContain('.claude/rules/backend-go.md');
    expect(artifactPaths).toContain('.claude/rules/backend-node.md');
    expect(artifactPaths).toContain('.claude/rules/frontend.md');
    expect(artifactPaths).toContain('.claude/rules/mobile.md');
  });

  it('collects CI steps from all stacks', () => {
    const config = resolveConfig(enterprisePreset({}));
    const project = compose(config);

    expect(project.ciSteps.length).toBeGreaterThan(0);
    const stepNames = project.ciSteps.map((s) => s.name);
    expect(stepNames).toContain('lint-go');
    expect(stepNames).toContain('test-go');
  });

  it('collects scripts from all stacks', () => {
    const config = resolveConfig(teamPlatformPreset({}));
    const project = compose(config);

    expect(project.scripts).toHaveProperty('db:generate');
    expect(project.scripts).toHaveProperty('lint:go');
  });

  it('includes design system artifacts for frontend projects', () => {
    const config = resolveConfig(soloSaasPreset({}));
    const project = compose(config);

    const outputPaths = project.templates.map((t) => t.outputPath);
    expect(outputPaths).toContain('packages/design-tokens/tokens.css');
    expect(outputPaths).toContain('packages/design-tokens/motion.ts');
    expect(outputPaths).toContain('packages/design-tokens/package.json');
    expect(outputPaths).toContain('packages/ui/package.json');
    expect(outputPaths).toContain('packages/ui/src/component-meta.ts');
    expect(outputPaths).toContain('packages/ui/src/primitives/cn.ts');
    expect(outputPaths).toContain('packages/ui/code-connect.ts');

    const artifactPaths = project.claudeArtifacts.map((a) => a.outputPath);
    expect(artifactPaths).toContain('.claude/rules/design-system.md');
    expect(artifactPaths).toContain('.claude/agents/design-reviewer.md');
    expect(artifactPaths).toContain('.claude/skills/design-review/SKILL.md');
    expect(artifactPaths).toContain('.claude/skills/figma-sync/SKILL.md');
    expect(artifactPaths).toContain('.claude/skills/figma-implement/SKILL.md');
  });

  it('minimal AI level includes only rules', () => {
    const config = resolveConfig(soloSaasPreset({}));
    config.aiLevel = 'minimal';
    const project = compose(config);

    const artifactTypes = new Set(project.claudeArtifacts.map((a) => a.type));
    expect(artifactTypes.has('rule')).toBe(true);
    expect(artifactTypes.has('agent')).toBe(false);
    expect(artifactTypes.has('skill')).toBe(false);
    expect(artifactTypes.has('hook')).toBe(false);
  });
});
