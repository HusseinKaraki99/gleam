export type {
  StackDefinition,
  StackDependency,
  TemplateFile,
  ConfigContribution,
  ClaudeArtifact,
  CiStep,
} from './types.js';

export { getStack, getStacks, getAllStacks, getStacksByCategory } from './registry.js';

export { nextjsStack } from './nextjs.js';
export { viteReactStack } from './vite-react.js';
export { nestjsStack } from './nestjs.js';
export { goServiceStack } from './go-service.js';
export { dotnetApiStack } from './dotnet-api.js';
export { expoStack } from './expo.js';
export { postgresDrizzleStack } from './postgres-drizzle.js';
export { postgresSqlcStack } from './postgres-sqlc.js';
export { postgresEfStack } from './postgres-ef.js';
