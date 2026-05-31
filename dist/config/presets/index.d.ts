export { soloSaasPreset } from './solo-saas.js';
export { teamPlatformPreset } from './team-platform.js';
export { enterprisePreset } from './enterprise.js';
export { fullstackMobilePreset } from './fullstack-mobile.js';
import type { ProjectConfig } from '../types.js';
export interface PresetInfo {
    id: string;
    name: string;
    description: string;
    create: (overrides: Partial<Pick<ProjectConfig, 'name' | 'displayName' | 'description' | 'org' | 'targetDir'>>) => ProjectConfig;
}
export declare const presets: PresetInfo[];
//# sourceMappingURL=index.d.ts.map