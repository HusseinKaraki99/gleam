export function teamPlatformPreset(overrides) {
    return {
        name: overrides.name ?? 'my-platform',
        displayName: overrides.displayName ?? 'My Platform',
        description: overrides.description ?? 'A team platform with Go backend and Next.js frontend',
        org: overrides.org ?? '@my-org',
        targetDir: overrides.targetDir ?? '.',
        teamSize: 'team',
        frontend: {
            apps: [
                { name: 'web', type: 'next-ssr' },
                { name: 'admin', type: 'vite-spa' },
            ],
        },
        backend: {
            services: [
                { name: 'api', type: 'go' },
                { name: 'worker', type: 'go' },
            ],
        },
        mobile: { enabled: false, type: 'none' },
        database: { type: 'postgres' },
        auth: 'clerk',
        multiTenancy: 'row-level',
        apiStyle: 'rest',
        i18n: { enabled: true, locales: ['en', 'ar'] },
        hosting: 'vercel-fly',
        aiLevel: 'full',
        design: {
            brandHue: 195,
            personality: 'professional',
            motionLevel: 'full',
            figmaFileKey: null,
        },
    };
}
//# sourceMappingURL=team-platform.js.map