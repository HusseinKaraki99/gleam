export const viteReactStack = {
    id: 'vite-spa',
    name: 'Vite + React',
    description: 'Vite-powered React SPA for client-side applications',
    category: 'frontend',
    dependencies: {
        npm: [
            { name: 'react', version: '^19.1.0' },
            { name: 'react-dom', version: '^19.1.0' },
            { name: 'react-router', version: '^7.6.0' },
            { name: 'tailwindcss', version: '^4.1.0' },
            { name: '@tailwindcss/vite', version: '^4.1.0', dev: true },
            { name: 'zod', version: '^3.24.0' },
            { name: '@tanstack/react-query', version: '^5.75.0' },
            { name: 'react-hook-form', version: '^7.56.0' },
            { name: '@hookform/resolvers', version: '^5.0.0' },
            { name: 'vite', version: '^6.3.0', dev: true },
            { name: '@vitejs/plugin-react', version: '^4.5.0', dev: true },
            { name: 'typescript', version: '^5.7.0', dev: true },
            { name: '@types/react', version: '^19.1.0', dev: true },
            { name: '@types/react-dom', version: '^19.1.0', dev: true },
            { name: 'vitest', version: '^3.0.0', dev: true },
            { name: '@testing-library/react', version: '^16.3.0', dev: true },
        ],
    },
    templates: [
        { templatePath: 'apps/vite-react/package.json.hbs', outputPath: 'apps/{{name}}/package.json' },
        { templatePath: 'apps/vite-react/vite.config.ts.hbs', outputPath: 'apps/{{name}}/vite.config.ts' },
        { templatePath: 'apps/vite-react/tsconfig.json.hbs', outputPath: 'apps/{{name}}/tsconfig.json' },
        { templatePath: 'apps/vite-react/index.html.hbs', outputPath: 'apps/{{name}}/index.html' },
        { templatePath: 'apps/vite-react/CLAUDE.md.hbs', outputPath: 'apps/{{name}}/CLAUDE.md' },
        { templatePath: 'apps/vite-react/src/main.tsx.hbs', outputPath: 'apps/{{name}}/src/main.tsx' },
        { templatePath: 'apps/vite-react/src/app.tsx.hbs', outputPath: 'apps/{{name}}/src/app.tsx' },
        { templatePath: 'apps/vite-react/src/index.css.hbs', outputPath: 'apps/{{name}}/src/index.css' },
        { templatePath: 'apps/vite-react/vitest.config.ts.hbs', outputPath: 'apps/{{name}}/vitest.config.ts' },
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
            build: { executor: 'nx:run-commands', options: { command: 'vite build' } },
            dev: { executor: 'nx:run-commands', options: { command: 'vite dev --port 3001' } },
            test: { executor: 'nx:run-commands', options: { command: 'vitest run' } },
        },
    },
};
//# sourceMappingURL=vite-react.js.map