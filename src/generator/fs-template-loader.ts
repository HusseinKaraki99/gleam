import * as fs from 'node:fs';
import * as path from 'node:path';
import type { TemplateLoader } from './template-loader.js';

// Templates resolve relative to the engine file by default, so the generator
// works from any cwd. The single-file distribution bundle lives at a different
// depth than the tsc output, so it sets GLEAM_TEMPLATES_DIR to point here
// explicitly (the Gleam plugin sets it to ${CLAUDE_PLUGIN_ROOT}/templates).
function templatesDir(): string {
  return process.env.GLEAM_TEMPLATES_DIR
    ? path.resolve(process.env.GLEAM_TEMPLATES_DIR)
    : path.resolve(import.meta.dirname, '../../templates');
}

/** Filesystem-backed loader used by the CLI, the skill, and the bundled engine. */
export function createFsTemplateLoader(): TemplateLoader {
  const root = templatesDir();
  return (templatePath: string): string => {
    const fullPath = path.join(root, templatePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Template not found: ${fullPath}`);
    }
    return fs.readFileSync(fullPath, 'utf-8');
  };
}
