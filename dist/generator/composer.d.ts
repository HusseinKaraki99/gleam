import type { ResolvedConfig } from '../config/types.js';
import type { StackDefinition, ClaudeArtifact, CiStep } from '../stacks/types.js';
export interface ComposedProject {
    templates: ResolvedTemplate[];
    claudeArtifacts: ClaudeArtifact[];
    ciSteps: CiStep[];
    stacks: StackDefinition[];
    scripts: Record<string, string>;
}
export interface ResolvedTemplate {
    templatePath: string;
    outputPath: string;
    context: Record<string, unknown>;
}
export declare function compose(config: ResolvedConfig): ComposedProject;
//# sourceMappingURL=composer.d.ts.map