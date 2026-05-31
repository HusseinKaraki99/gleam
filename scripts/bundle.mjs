// Bundles the Gleam engine into a single dependency-free ESM file so it can be
// shipped inside the Claude Code plugin and run with `node gleam.mjs` — no
// pnpm install, no node_modules. Handlebars is inlined.
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await build({
  entryPoints: [path.join(root, 'src/generate.ts')],
  outfile: path.join(root, 'dist/gleam.mjs'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  // Banner: esbuild leaves `import.meta` intact for esm, but the bundle sits at
  // a different depth than the tsc output. The plugin passes GLEAM_TEMPLATES_DIR
  // so the renderer never relies on the bundle's own location.
  banner: { js: '// Gleam engine — generated bundle. Do not edit by hand.' },
});

console.log('Bundled dist/gleam.mjs');
