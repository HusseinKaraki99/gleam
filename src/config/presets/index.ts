export { soloSaasPreset } from './solo-saas.js';
export { teamPlatformPreset } from './team-platform.js';
export { enterprisePreset } from './enterprise.js';
export { fullstackMobilePreset } from './fullstack-mobile.js';

import type { ProjectConfig } from '../types.js';
import { soloSaasPreset } from './solo-saas.js';
import { teamPlatformPreset } from './team-platform.js';
import { enterprisePreset } from './enterprise.js';
import { fullstackMobilePreset } from './fullstack-mobile.js';

export interface PresetInfo {
  id: string;
  name: string;
  description: string;
  create: (overrides: Partial<Pick<ProjectConfig, 'name' | 'displayName' | 'description' | 'org' | 'targetDir'>>) => ProjectConfig;
}

export const presets: PresetInfo[] = [
  {
    id: 'solo-saas',
    name: 'Solo SaaS',
    description: 'Next.js + NestJS + Postgres/Drizzle + Clerk. Best for solo developers building a SaaS product.',
    create: soloSaasPreset,
  },
  {
    id: 'team-platform',
    name: 'Team Platform',
    description: 'Next.js + Go API + Postgres/sqlc + multi-tenancy. Best for teams building a platform product.',
    create: teamPlatformPreset,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Next.js + Go services + Expo + multi-tenancy + i18n. Best for large teams building enterprise systems.',
    create: enterprisePreset,
  },
  {
    id: 'fullstack-mobile',
    name: 'Fullstack Mobile',
    description: 'Next.js + NestJS + Expo + Postgres. Best for small teams building web + mobile apps.',
    create: fullstackMobilePreset,
  },
];
