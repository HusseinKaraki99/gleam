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
    i18n: {
        enabled: boolean;
        locales: string[];
    };
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
export declare function resolveConfig(config: ProjectConfig): ResolvedConfig;
//# sourceMappingURL=types.d.ts.map