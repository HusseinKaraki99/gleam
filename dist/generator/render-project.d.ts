import type { ProjectConfig } from '../config/types.js';
import type { RenderedFile } from './renderer.js';
import type { TemplateLoader } from './template-loader.js';
/**
 * Pure, filesystem-free generation core: resolve → compose → render.
 * Returns every rendered file in memory. The template source comes from the
 * injected loader, so this exact function backs the Node CLI (fs loader) and
 * the browser playground (in-memory map loader) with identical output.
 */
export declare function renderProjectFiles(config: ProjectConfig, loadTemplate: TemplateLoader): RenderedFile[];
//# sourceMappingURL=render-project.d.ts.map