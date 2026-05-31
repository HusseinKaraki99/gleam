import * as fs from 'node:fs';
import * as path from 'node:path';
export function writeFiles(targetDir, files) {
    let filesWritten = 0;
    const directoriesCreated = new Set();
    const errors = [];
    for (const file of files) {
        try {
            const fullPath = path.join(targetDir, file.path);
            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                directoriesCreated.add(dir);
            }
            fs.writeFileSync(fullPath, file.content, 'utf-8');
            filesWritten++;
        }
        catch (err) {
            errors.push({
                path: file.path,
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }
    return {
        filesWritten,
        directoriesCreated: directoriesCreated.size,
        errors,
    };
}
export function ensureTargetDir(targetDir) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    const entries = fs.readdirSync(targetDir);
    const nonHidden = entries.filter((e) => !e.startsWith('.'));
    if (nonHidden.length > 0) {
        throw new Error(`Target directory ${targetDir} is not empty. Found: ${nonHidden.slice(0, 5).join(', ')}${nonHidden.length > 5 ? '...' : ''}`);
    }
}
//# sourceMappingURL=writer.js.map