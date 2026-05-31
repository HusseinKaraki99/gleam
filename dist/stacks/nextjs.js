export const nextjsStack = {
    id: 'next-ssr',
    name: 'Next.js',
    description: 'Next.js App Router with SSR, RSC, and server actions',
    category: 'frontend',
    dependencies: {
        npm: [
            { name: 'next', version: '^15.3.0' },
            { name: 'react', version: '^19.1.0' },
            { name: 'react-dom', version: '^19.1.0' },
            { name: 'tailwindcss', version: '^4.1.0' },
            { name: '@tailwindcss/postcss', version: '^4.1.0', dev: true },
            { name: 'postcss', version: '^8.5.0', dev: true },
            { name: 'zod', version: '^3.24.0' },
            { name: '@tanstack/react-query', version: '^5.75.0' },
            { name: 'react-hook-form', version: '^7.56.0' },
            { name: '@hookform/resolvers', version: '^5.0.0' },
            { name: 'typescript', version: '^5.7.0', dev: true },
            { name: '@types/react', version: '^19.1.0', dev: true },
            { name: '@types/react-dom', version: '^19.1.0', dev: true },
            { name: 'vitest', version: '^3.0.0', dev: true },
            { name: '@testing-library/react', version: '^16.3.0', dev: true },
            { name: '@playwright/test', version: '^1.52.0', dev: true },
        ],
    },
    templates: [
        { templatePath: 'apps/nextjs/package.json.hbs', outputPath: 'apps/{{name}}/package.json' },
        { templatePath: 'apps/nextjs/next.config.ts.hbs', outputPath: 'apps/{{name}}/next.config.ts' },
        { templatePath: 'apps/nextjs/tsconfig.json.hbs', outputPath: 'apps/{{name}}/tsconfig.json' },
        { templatePath: 'apps/nextjs/postcss.config.mjs.hbs', outputPath: 'apps/{{name}}/postcss.config.mjs' },
        { templatePath: 'apps/nextjs/CLAUDE.md.hbs', outputPath: 'apps/{{name}}/CLAUDE.md' },
        { templatePath: 'apps/nextjs/src/app/layout.tsx.hbs', outputPath: 'apps/{{name}}/src/app/layout.tsx' },
        { templatePath: 'apps/nextjs/src/app/page.tsx.hbs', outputPath: 'apps/{{name}}/src/app/page.tsx' },
        { templatePath: 'apps/nextjs/src/app/globals.css.hbs', outputPath: 'apps/{{name}}/src/app/globals.css' },
        { templatePath: 'apps/nextjs/src/lib/api/client.ts.hbs', outputPath: 'apps/{{name}}/src/lib/api/client.ts' },
        { templatePath: 'apps/nextjs/vitest.config.ts.hbs', outputPath: 'apps/{{name}}/vitest.config.ts' },
    ],
    configContributions: [
        {
            target: 'tsconfig.base.json',
            merge: { compilerOptions: { paths: {} } },
        },
    ],
    claudeArtifacts: [
        { type: 'rule', templatePath: 'claude/rules/frontend.md.hbs', outputPath: '.claude/rules/frontend.md' },
        { type: 'agent', templatePath: 'claude/agents/react-architect.md.hbs', outputPath: '.claude/agents/react-architect.md' },
    ],
    ciSteps: [
        { name: 'typecheck-frontend', command: 'nx run-many -t typecheck --projects=tag:scope:frontend' },
        { name: 'test-frontend', command: 'nx run-many -t test --projects=tag:scope:frontend' },
        { name: 'build-frontend', command: 'nx run-many -t build --projects=tag:scope:frontend' },
    ],
    nxProjectConfig: {
        tags: ['scope:frontend'],
        targets: {
            build: { executor: '@nx/next:build' },
            dev: { executor: '@nx/next:server', options: { port: 3000 } },
            test: { executor: 'nx:run-commands', options: { command: 'vitest run' } },
        },
    },
};
//# sourceMappingURL=nextjs.js.map