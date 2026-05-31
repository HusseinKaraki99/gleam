import type { StackDefinition } from './types.js';
import { nextjsStack } from './nextjs.js';
import { viteReactStack } from './vite-react.js';
import { nestjsStack } from './nestjs.js';
import { goServiceStack } from './go-service.js';
import { dotnetApiStack } from './dotnet-api.js';
import { expoStack } from './expo.js';
import { postgresDrizzleStack } from './postgres-drizzle.js';
import { postgresSqlcStack } from './postgres-sqlc.js';
import { postgresEfStack } from './postgres-ef.js';

const allStacks: StackDefinition[] = [
  nextjsStack,
  viteReactStack,
  nestjsStack,
  goServiceStack,
  dotnetApiStack,
  expoStack,
  postgresDrizzleStack,
  postgresSqlcStack,
  postgresEfStack,
];

const stackMap = new Map<string, StackDefinition>(
  allStacks.map((s) => [s.id, s])
);

export function getStack(id: string): StackDefinition {
  const stack = stackMap.get(id);
  if (!stack) {
    throw new Error(`Unknown stack: ${id}. Available: ${[...stackMap.keys()].join(', ')}`);
  }
  return stack;
}

export function getStacks(ids: string[]): StackDefinition[] {
  return ids.map(getStack);
}

export function getAllStacks(): StackDefinition[] {
  return [...allStacks];
}

export function getStacksByCategory(category: StackDefinition['category']): StackDefinition[] {
  return allStacks.filter((s) => s.category === category);
}
