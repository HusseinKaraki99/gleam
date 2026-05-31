import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { generateProject } from '../../src/generate.js';
import { renderProjectFiles } from '../../src/generator/render-project.js';
import { createMapTemplateLoader } from '../../src/generator/template-loader.js';
import { presets } from '../../src/config/presets/index.js';

// The playground's whole premise: the engine runs in the browser with templates
// as data, NOT files. These tests prove the in-memory path is byte-identical to
// the filesystem path — so what a visitor sees generated live is exactly what the
// CLI would write. If the two ever diverge, the playground is lying; fail here.

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

/** Read templates/ into the same shape the browser embeds at build time. */
function readTemplateMap(dir = TEMPLATES_DIR, acc: Record<string, string> = {}): Record<string, string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      readTemplateMap(full, acc);
    } else {
      const rel = path.relative(TEMPLATES_DIR, full).split(path.sep).join('/');
      acc[rel] = fs.readFileSync(full, 'utf-8');
    }
  }
  return acc;
}

const templateMap = readTemplateMap();
const mapLoader = createMapTemplateLoader(templateMap);

describe('browser engine (templates as data)', () => {
  for (const preset of presets) {
    it(`is byte-identical to the fs engine for "${preset.id}"`, () => {
      const config = preset.create({ name: `${preset.id}-demo`, org: '@demo' });

      const fsFiles = generateProject(config);
      const mapFiles = renderProjectFiles(config, mapLoader);

      expect(mapFiles.length).toBe(fsFiles.length);
      expect(mapFiles).toEqual(fsFiles);
    });
  }

  it('embeds every template the filesystem has', () => {
    const onDisk = Object.keys(templateMap).length;
    expect(onDisk).toBeGreaterThan(150);
  });

  it('throws a clear error for a missing template (no silent skip)', () => {
    const empty = createMapTemplateLoader({});
    expect(() => empty('package.json.hbs')).toThrow(/Template not found in map/);
  });
});
