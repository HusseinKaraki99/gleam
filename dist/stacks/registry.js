import { nextjsStack } from './nextjs.js';
import { viteReactStack } from './vite-react.js';
import { nestjsStack } from './nestjs.js';
import { goServiceStack } from './go-service.js';
import { dotnetApiStack } from './dotnet-api.js';
import { expoStack } from './expo.js';
import { postgresDrizzleStack } from './postgres-drizzle.js';
import { postgresSqlcStack } from './postgres-sqlc.js';
import { postgresEfStack } from './postgres-ef.js';
const allStacks = [
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
const stackMap = new Map(allStacks.map((s) => [s.id, s]));
export function getStack(id) {
    const stack = stackMap.get(id);
    if (!stack) {
        throw new Error(`Unknown stack: ${id}. Available: ${[...stackMap.keys()].join(', ')}`);
    }
    return stack;
}
export function getStacks(ids) {
    return ids.map(getStack);
}
export function getAllStacks() {
    return [...allStacks];
}
export function getStacksByCategory(category) {
    return allStacks.filter((s) => s.category === category);
}
//# sourceMappingURL=registry.js.map