export function soloSaasPreset(overrides) {
    return {
        name: overrides.name ?? 'my-saas',
        displayName: overrides.displayName ?? 'My SaaS',
        description: overrides.description ?? 'A modern SaaS application',
        org: overrides.org ?? '@my-org',
        targetDir: overrides.targetDir ?? '.',
        teamSize: 'solo',
        frontend: {
            apps: [{ name: 'web', type: 'next-ssr' }],
        },
        backend: {
            services: [{ name: 'api', type: 'nestjs' }],
        },
        mobile: { enabled: false, type: 'none' },
        database: { type: 'postgres' },
        auth: 'clerk',
        multiTenancy: 'none',
        apiStyle: 'rest',
        i18n: { enabled: false, locales: [] },
        hosting: 'vercel-fly',
        aiLevel: 'standard',
        design: {
            brandHue: 220,
            personality: 'professional',
            motionLevel: 'subtle',
            figmaFileKey: null,
        },
    };
}
//# sourceMappingURL=solo-saas.js.map