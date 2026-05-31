export const expoStack = {
    id: 'expo',
    name: 'Expo',
    description: 'React Native with Expo for cross-platform mobile apps',
    category: 'mobile',
    dependencies: {
        npm: [
            { name: 'expo', version: '~52.0.0' },
            { name: 'react', version: '^19.1.0' },
            { name: 'react-native', version: '^0.79.0' },
            { name: 'expo-router', version: '~4.0.0' },
            { name: 'expo-status-bar', version: '~2.2.0' },
            { name: 'react-native-safe-area-context', version: '^5.4.0' },
            { name: 'react-native-screens', version: '~4.9.0' },
            { name: '@tanstack/react-query', version: '^5.75.0' },
            { name: 'zod', version: '^3.24.0' },
            { name: 'typescript', version: '^5.7.0', dev: true },
            { name: '@types/react', version: '^19.1.0', dev: true },
        ],
    },
    templates: [
        { templatePath: 'apps/expo/package.json.hbs', outputPath: 'apps/{{name}}/package.json' },
        { templatePath: 'apps/expo/app.json.hbs', outputPath: 'apps/{{name}}/app.json' },
        { templatePath: 'apps/expo/tsconfig.json.hbs', outputPath: 'apps/{{name}}/tsconfig.json' },
        { templatePath: 'apps/expo/CLAUDE.md.hbs', outputPath: 'apps/{{name}}/CLAUDE.md' },
        { templatePath: 'apps/expo/app/_layout.tsx.hbs', outputPath: 'apps/{{name}}/app/_layout.tsx' },
        { templatePath: 'apps/expo/app/index.tsx.hbs', outputPath: 'apps/{{name}}/app/index.tsx' },
    ],
    configContributions: [],
    claudeArtifacts: [
        { type: 'rule', templatePath: 'claude/rules/mobile.md.hbs', outputPath: '.claude/rules/mobile.md' },
    ],
    ciSteps: [
        { name: 'typecheck-mobile', command: 'nx run mobile:typecheck' },
    ],
    nxProjectConfig: {
        tags: ['scope:mobile'],
    },
};
//# sourceMappingURL=expo.js.map