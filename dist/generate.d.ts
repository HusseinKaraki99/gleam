import type { ProjectConfig } from './config/types.js';
import type { RenderedFile } from './generator/renderer.js';
import type { WriteResult } from './generator/writer.js';
import type { PostProcessResult } from './generator/post-process.js';
/**
 * Pure, in-memory generation: resolve → compose → render.
 * Returns every rendered file without touching disk. This is the
 * reusable core — the same function backs the CLI runner, the
 * /init-project skill, and (once bundled) the landing-page playground.
 */
export declare function generateProject(config: ProjectConfig): RenderedFile[];
export interface GenerateToDiskOptions {
    targetDir: string;
    runPostProcess?: boolean;
}
export interface GenerateToDiskResult {
    files: RenderedFile[];
    write: WriteResult;
    postProcess: PostProcessResult | null;
}
/** Render the project and write it to disk, optionally running git/install steps. */
export declare function generateToDisk(config: ProjectConfig, options: GenerateToDiskOptions): GenerateToDiskResult;
export declare class GenerationError extends Error {
    constructor(targetDir: string, reasons: string[]);
}
//# sourceMappingURL=generate.d.ts.map