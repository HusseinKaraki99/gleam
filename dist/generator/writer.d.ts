import type { RenderedFile } from './renderer.js';
export interface WriteResult {
    filesWritten: number;
    directoriesCreated: number;
    errors: WriteError[];
}
export interface WriteError {
    path: string;
    error: string;
}
export declare function writeFiles(targetDir: string, files: RenderedFile[]): WriteResult;
export declare function ensureTargetDir(targetDir: string): void;
//# sourceMappingURL=writer.d.ts.map