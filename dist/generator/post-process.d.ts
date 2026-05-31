import type { ResolvedConfig } from '../config/types.js';
export interface PostProcessResult {
    steps: PostProcessStep[];
}
export interface PostProcessStep {
    name: string;
    success: boolean;
    output?: string;
    error?: string;
}
export declare function postProcess(targetDir: string, config: ResolvedConfig): PostProcessResult;
//# sourceMappingURL=post-process.d.ts.map