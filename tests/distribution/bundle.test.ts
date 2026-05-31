import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Guards the distribution claim: the shipped engine is a single, dependency-free
// file that runs from ANY working directory. These tests run dist/gleam.mjs as a
// real child process from a foreign cwd — exactly how the installed plugin runs
// it — so a regression in bundling or path resolution fails here, not in a user's
// terminal.

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BUNDLE = path.join(ROOT, 'dist/gleam.mjs');
const TEMPLATES = path.join(ROOT, 'templates');
const FOREIGN_CWD = os.tmpdir();

function runBundle(args: string[]): string {
  return execFileSync('node', [BUNDLE, ...args], {
    cwd: FOREIGN_CWD,
    env: { ...process.env, GLEAM_TEMPLATES_DIR: TEMPLATES },
    encoding: 'utf-8',
  });
}

describe('shipped bundle (dist/gleam.mjs)', () => {
  const outDir = path.join(os.tmpdir(), 'gleam-bundle-test');

  beforeAll(() => {
    // Build a fresh bundle so the test reflects current source, not a stale artifact.
    execFileSync('node', [path.join(ROOT, 'scripts/bundle.mjs')], { cwd: ROOT });
    fs.rmSync(outDir, { recursive: true, force: true });
  });

  afterAll(() => {
    fs.rmSync(outDir, { recursive: true, force: true });
  });

  it('exists as a single file with no node_modules dependency', () => {
    expect(fs.existsSync(BUNDLE)).toBe(true);
    // Inlined handlebars: the bundle must not re-import it at runtime.
    const src = fs.readFileSync(BUNDLE, 'utf-8');
    expect(src).not.toMatch(/from\s+["']handlebars["']/);
    expect(src).not.toMatch(/require\(["']handlebars["']\)/);
  });

  it('renders a manifest from a foreign cwd (dry-run)', () => {
    const out = runBundle(['--preset', 'solo-saas', '--name', 'distcheck', '--dry-run']);
    expect(out).toMatch(/files for "distcheck"/);
    expect(out).toContain('package.json');
  });

  it('writes a real project from a foreign cwd', () => {
    runBundle([
      '--preset',
      'solo-saas',
      '--name',
      'distcheck',
      '--target',
      outDir,
      '--no-post-process',
    ]);
    const pkgPath = path.join(outDir, 'package.json');
    expect(fs.existsSync(pkgPath)).toBe(true);
    expect(() => JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))).not.toThrow();

    const fileCount = fs
      .readdirSync(outDir, { recursive: true })
      .filter((p) => fs.statSync(path.join(outDir, p as string)).isFile()).length;
    expect(fileCount).toBeGreaterThan(50);
  });
});
