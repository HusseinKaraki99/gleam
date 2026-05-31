export type FrontendType = 'next-ssr' | 'vite-spa';
export type BackendType = 'nestjs' | 'go' | 'dotnet';
export type DatabaseType = 'postgres' | 'sqlite' | 'none';
export type OrmType = 'drizzle' | 'sqlc' | 'ef-core' | 'none';
export type AuthProvider = 'clerk' | 'auth0' | 'custom' | 'none';
export type MultiTenancy = 'row-level' | 'schema' | 'none';
export type ApiStyle = 'rest' | 'graphql' | 'trpc';
export type HostingTarget = 'vercel-fly' | 'aws' | 'gcp' | 'self-hosted';
export type TeamSize = 'solo' | 'small' | 'team' | 'large';
export type AiLevel = 'full' | 'standard' | 'minimal';
export type MobileType = 'expo' | 'none';
export type BrandPersonality = 'professional' | 'playful' | 'minimal' | 'bold';
export type MotionLevel = 'full' | 'subtle' | 'none';

export interface FrontendApp {
  name: string;
  type: FrontendType;
}

export interface BackendService {
  name: string;
  type: BackendType;
}

export interface ProjectConfig {
  name: string;
  displayName: string;
  description: string;
  org: string;
  targetDir: string;

  teamSize: TeamSize;

  frontend: {
    apps: FrontendApp[];
  };

  backend: {
    services: BackendService[];
  };

  mobile: {
    enabled: boolean;
    type: MobileType;
  };

  database: {
    type: DatabaseType;
  };

  auth: AuthProvider;
  multiTenancy: MultiTenancy;
  apiStyle: ApiStyle;
  i18n: { enabled: boolean; locales: string[] };
  hosting: HostingTarget;
  aiLevel: AiLevel;

  design: {
    brandHue: number;
    personality: BrandPersonality;
    motionLevel: MotionLevel;
    figmaFileKey: string | null;
  };
}

export interface ResolvedConfig extends ProjectConfig {
  isPolyglot: boolean;
  needsGoWork: boolean;
  needsDocker: boolean;
  hasFrontend: boolean;
  backendLanguages: Set<BackendType>;
  ormPerService: Map<string, OrmType>;
  allStackIds: string[];
}

export function resolveConfig(config: ProjectConfig): ResolvedConfig {
  const backendLanguages = new Set(
    config.backend.services.map((s) => s.type)
  );

  const hasGo = backendLanguages.has('go');
  const hasDotnet = backendLanguages.has('dotnet');
  const isPolyglot = backendLanguages.size > 1;

  const ormPerService = new Map<string, OrmType>();
  for (const service of config.backend.services) {
    if (config.database.type === 'none') {
      ormPerService.set(service.name, 'none');
    } else {
      switch (service.type) {
        case 'nestjs':
          ormPerService.set(service.name, 'drizzle');
          break;
        case 'go':
          ormPerService.set(service.name, 'sqlc');
          break;
        case 'dotnet':
          ormPerService.set(service.name, 'ef-core');
          break;
      }
    }
  }

  const allStackIds: string[] = [];
  for (const app of config.frontend.apps) {
    allStackIds.push(app.type);
  }
  for (const service of config.backend.services) {
    allStackIds.push(service.type);
  }
  if (config.mobile.enabled) {
    allStackIds.push('expo');
  }
  if (config.database.type !== 'none') {
    allStackIds.push(`${config.database.type}`);
    for (const orm of ormPerService.values()) {
      if (orm !== 'none') allStackIds.push(orm);
    }
  }

  return {
    ...config,
    isPolyglot,
    needsGoWork: hasGo,
    needsDocker: hasGo || hasDotnet || config.backend.services.length > 1,
    hasFrontend: config.frontend.apps.length > 0 || config.mobile.enabled,
    backendLanguages,
    ormPerService,
    allStackIds: [...new Set(allStackIds)],
  };
}
