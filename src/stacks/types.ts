export interface StackDependency {
  name: string;
  version: string;
  dev?: boolean;
}

export interface TemplateFile {
  templatePath: string;
  outputPath: string;
  condition?: string;
}

export interface ConfigContribution {
  target: string;
  merge: Record<string, unknown>;
}

export interface ClaudeArtifact {
  type: 'rule' | 'agent' | 'skill' | 'hook';
  templatePath: string;
  outputPath: string;
}

export interface CiStep {
  name: string;
  command: string;
  condition?: string;
}

export interface StackDefinition {
  id: string;
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'orm';

  dependencies: {
    npm?: StackDependency[];
    goModules?: string[];
    nuget?: string[];
  };

  templates: TemplateFile[];
  configContributions: ConfigContribution[];
  claudeArtifacts: ClaudeArtifact[];
  ciSteps: CiStep[];

  nxProjectConfig?: Record<string, unknown>;
  scripts?: Record<string, string>;
}
