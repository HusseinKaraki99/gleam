import { describe, it, expect } from 'vitest';
import { getStack, getStacks, getAllStacks, getStacksByCategory } from '../../src/stacks/registry.js';

describe('stack registry', () => {
  it('returns all 9 stacks', () => {
    expect(getAllStacks()).toHaveLength(9);
  });

  it('finds a stack by id', () => {
    const stack = getStack('next-ssr');
    expect(stack.name).toBe('Next.js');
    expect(stack.category).toBe('frontend');
  });

  it('throws for unknown stack', () => {
    expect(() => getStack('unknown')).toThrow('Unknown stack: unknown');
  });

  it('returns multiple stacks by id', () => {
    const stacks = getStacks(['next-ssr', 'nestjs']);
    expect(stacks).toHaveLength(2);
    expect(stacks[0].id).toBe('next-ssr');
    expect(stacks[1].id).toBe('nestjs');
  });

  it('filters stacks by category', () => {
    const frontends = getStacksByCategory('frontend');
    expect(frontends).toHaveLength(2);
    expect(frontends.every((s) => s.category === 'frontend')).toBe(true);

    const backends = getStacksByCategory('backend');
    expect(backends).toHaveLength(3);

    const orms = getStacksByCategory('orm');
    expect(orms).toHaveLength(3);
  });

  it('each stack has required fields', () => {
    for (const stack of getAllStacks()) {
      expect(stack.id).toBeTruthy();
      expect(stack.name).toBeTruthy();
      expect(stack.description).toBeTruthy();
      expect(stack.category).toBeTruthy();
      expect(Array.isArray(stack.templates)).toBe(true);
      expect(Array.isArray(stack.claudeArtifacts)).toBe(true);
      expect(Array.isArray(stack.ciSteps)).toBe(true);
    }
  });
});
