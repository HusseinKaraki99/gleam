import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';
export function postProcess(targetDir, config) {
    const steps = [];
    steps.push(runStep('git init', targetDir, 'git init'));
    steps.push(runStep('git branch -m main', targetDir, 'git branch -m main'));
    if (hasNodePackages(targetDir)) {
        steps.push(runStep('pnpm install', targetDir, 'pnpm install'));
    }
    if (config.needsGoWork) {
        steps.push(runStep('go work sync', targetDir, 'go work sync'));
    }
    steps.push(runStep('git add .', targetDir, 'git add .'));
    steps.push(runStep('initial commit', targetDir, 'git commit -m "feat: initial project scaffold by Gleam"'));
    return { steps };
}
function runStep(name, cwd, command) {
    try {
        const output = execSync(command, {
            cwd,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 120_000,
        });
        return { name, success: true, output: output.trim() };
    }
    catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        return { name, success: false, error };
    }
}
function hasNodePackages(targetDir) {
    return fs.existsSync(path.join(targetDir, 'package.json'));
}
//# sourceMappingURL=post-process.js.map