import type { ProjectConfig } from '../types.js';

export function enterprisePreset(
  overrides: Partial<Pick<ProjectConfig, 'name' | 'displayName' | 'description' | 'org' | 'targetDir'>>
): ProjectConfig {
  return {
    name: overrides.name ?? 'my-enterprise',
    displayName: overrides.displayName ?? 'My Enterprise Platform',
    description: overrides.description ?? 'An enterprise platform with Go microservices, Next.js frontend, and mobile app',
    org: overrides.org ?? '@my-org',
    targetDir: overrides.targetDir ?? '.',

    teamSize: 'large',

    frontend: {
      apps: [
        { name: 'web', type: 'next-ssr' },
        { name: 'admin', type: 'vite-spa' },
        { name: 'marketing', type: 'next-ssr' },
      ],
    },

    backend: {
      services: [
        { name: 'api', type: 'go' },
        { name: 'worker', type: 'go' },
        { name: 'notifications', type: 'nestjs' },
      ],
    },

    mobile: { enabled: true, type: 'expo' },

    database: { type: 'postgres' },

    auth: 'clerk',
    multiTenancy: 'row-level',
    apiStyle: 'rest',
    i18n: { enabled: true, locales: ['en', 'ar', 'fr'] },
    hosting: 'gcp',
    aiLevel: 'full',

    design: {
      brandHue: 195,
      personality: 'professional',
      motionLevel: 'full',
      figmaFileKey: null,
    },
  };
}
