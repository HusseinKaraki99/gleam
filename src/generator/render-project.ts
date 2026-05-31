import type { ProjectConfig } from '../config/types.js';
import { resolveConfig } from '../config/types.js';
import { compose } from './composer.js';
import { createRenderer } from './renderer.js';
import type { RenderedFile } from './renderer.js';
import type { TemplateLoader } from './template-loader.js';

/**
 * Pure, filesystem-free generation core: resolve → compose → render.
 * Returns every rendered file in memory. The template source comes from the
 * injected loader, so this exact function backs the Node CLI (fs loader) and
 * the browser playground (in-memory map loader) with identical output.
 */
export function renderProjectFiles(
  config: ProjectConfig,
  loadTemplate: TemplateLoader,
): RenderedFile[] {
  const resolved = resolveConfig(config);
  const composed = compose(resolved);
  const renderer = createRenderer(loadTemplate);
  return renderer.renderProject(composed, resolved);
}
