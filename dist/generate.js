import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveConfig } from './config/types.js';
import { renderProjectFiles } from './generator/render-project.js';
import { createFsTemplateLoader } from './generator/fs-template-loader.js';
import { writeFiles, ensureTargetDir } from './generator/writer.js';
import { postProcess } from './generator/post-process.js';
import { presets } from './config/presets/index.js';
/**
 * Pure, in-memory generation: resolve → compose → render.
 * Returns every rendered file without touching disk. This is the
 * reusable core — the same function backs the CLI runner, the
 * /init-project skill, and (once bundled) the landing-page playground.
 */
export function generateProject(config) {
    return renderProjectFiles(config, createFsTemplateLoader());
}
/** Render the project and write it to disk, optionally running git/install steps. */
export function generateToDisk(config, options) {
    const targetDir = path.resolve(options.targetDir);
    ensureTargetDir(targetDir);
    const files = generateProject(config);
    const write = writeFiles(targetDir, files);
    if (write.errors.length > 0) {
        throw new GenerationError(targetDir, write.errors.map((e) => `${e.path}: ${e.error}`));
    }
    const post = options.runPostProcess
        ? postProcess(targetDir, resolveConfig(config))
        : null;
    return { files, write, postProcess: post };
}
export class GenerationError extends Error {
    constructor(targetDir, reasons) {
        super(`Generation failed for ${targetDir}:\n  ${reasons.join('\n  ')}`);
        this.name = 'GenerationError';
    }
}
function parseFlags(argv) {
    const flags = { dryRun: false, noPostProcess: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--dry-run')
            flags.dryRun = true;
        else if (arg === '--no-post-process')
            flags.noPostProcess = true;
        else if (arg === '--preset')
            flags.preset = argv[++i];
        else if (arg === '--config')
            flags.config = argv[++i];
        else if (arg === '--target')
            flags.target = argv[++i];
        else if (arg === '--name')
            flags.name = argv[++i];
        else if (arg === '--display-name')
            flags.displayName = argv[++i];
        else if (arg === '--description')
            flags.description = argv[++i];
        else if (arg === '--org')
            flags.org = argv[++i];
        else
            throw new Error(`Unknown argument: ${arg}`);
    }
    return flags;
}
function configFromFlags(flags) {
    if (flags.config) {
        return JSON.parse(flags.config);
    }
    if (!flags.preset) {
        throw new Error('Provide either --preset <id> or --config <json>.');
    }
    const preset = presets.find((p) => p.id === flags.preset);
    if (!preset) {
        const ids = presets.map((p) => p.id).join(', ');
        throw new Error(`Unknown preset "${flags.preset}". Available: ${ids}`);
    }
    return preset.create({
        name: flags.name,
        displayName: flags.displayName,
        description: flags.description,
        org: flags.org,
        targetDir: flags.target,
    });
}
function main(argv) {
    const flags = parseFlags(argv);
    const config = configFromFlags(flags);
    const targetDir = flags.target ?? config.targetDir;
    if (flags.dryRun) {
        const files = generateProject(config);
        console.log(`[dry-run] ${files.length} files for "${config.name}":`);
        for (const file of files.map((f) => f.path).sort())
            console.log(`  ${file}`);
        return;
    }
    const result = generateToDisk(config, {
        targetDir,
        runPostProcess: !flags.noPostProcess,
    });
    console.log(`Generated ${result.write.filesWritten} files into ${path.resolve(targetDir)} ` +
        `(${result.write.directoriesCreated} directories).`);
    if (result.postProcess) {
        for (const step of result.postProcess.steps) {
            console.log(`  ${step.success ? '✓' : '✗'} ${step.name}`);
        }
    }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        main(process.argv.slice(2));
    }
    catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}
//# sourceMappingURL=generate.js.map