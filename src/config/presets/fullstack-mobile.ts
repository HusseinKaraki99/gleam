import type { ProjectConfig } from '../types.js';

export function fullstackMobilePreset(
  overrides: Partial<Pick<ProjectConfig, 'name' | 'displayName' | 'description' | 'org' | 'targetDir'>>
): ProjectConfig {
  return {
    name: overrides.name ?? 'my-app',
    displayName: overrides.displayName ?? 'My App',
    description: overrides.description ?? 'A full-stack application with web and mobile clients',
    org: overrides.org ?? '@my-org',
    targetDir: overrides.targetDir ?? '.',

    teamSize: 'small',

    frontend: {
      apps: [{ name: 'web', type: 'next-ssr' }],
    },

    backend: {
      services: [{ name: 'api', type: 'nestjs' }],
    },

    mobile: { enabled: true, type: 'expo' },

    database: { type: 'postgres' },

    auth: 'clerk',
    multiTenancy: 'none',
    apiStyle: 'rest',
    i18n: { enabled: false, locales: [] },
    hosting: 'vercel-fly',
    aiLevel: 'standard',

    design: {
      brandHue: 250,
      personality: 'playful',
      motionLevel: 'full',
      figmaFileKey: null,
    },
  };
}
