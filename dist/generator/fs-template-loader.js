import * as fs from 'node:fs';
import * as path from 'node:path';
// Templates resolve relative to the engine file by default, so the generator
// works from any cwd. The single-file distribution bundle lives at a different
// depth than the tsc output, so it sets GLEAM_TEMPLATES_DIR to point here
// explicitly (the Gleam plugin sets it to ${CLAUDE_PLUGIN_ROOT}/templates).
function templatesDir() {
    return process.env.GLEAM_TEMPLATES_DIR
        ? path.resolve(process.env.GLEAM_TEMPLATES_DIR)
        : path.resolve(import.meta.dirname, '../../templates');
}
/** Filesystem-backed loader used by the CLI, the skill, and the bundled engine. */
export function createFsTemplateLoader() {
    const root = templatesDir();
    return (templatePath) => {
        const fullPath = path.join(root, templatePath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Template not found: ${fullPath}`);
        }
        return fs.readFileSync(fullPath, 'utf-8');
    };
}
//# sourceMappingURL=fs-template-loader.js.map