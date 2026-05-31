import { describe, it, expect } from 'vitest';
import { generateProject } from '../../src/generate.js';
import type { RenderedFile } from '../../src/generator/renderer.js';
import type { ProjectConfig } from '../../src/config/types.js';
import { presets } from '../../src/config/presets/index.js';

const OVERRIDES = {
  name: 'acme',
  displayName: 'Acme',
  description: 'Acme application',
  org: '@acme',
  targetDir: '.',
};

// A leaked, unrendered Handlebars token always references a context root,
// a block/partial, or a known helper. JSX object literals (`{{ scale: 1 }}`),
// GitHub Actions expressions (`${{ ... }}`), and doc examples (`style={{}}`)
// are legitimate output and must NOT be flagged.
const HELPERS = [
  'kebabCase', 'pascalCase', 'camelCase', 'upperCase', 'json', 'join', 'year',
  'ifEquals', 'ifIncludes', 'ifHasStack', 'ifMultiTenancy', 'ifI18n',
];
const HANDLEBARS_RESIDUE = new RegExp(
  [
    '\\{\\{[#/>]', // block open/close or partial
    '\\{\\{~?\\s*else\\b',
    '\\{\\{~?\\s*(config|project|this)\\b', // context roots
    `\\{\\{~?\\s*(${HELPERS.join('|')})\\b`, // helper invocations
  ].join('|'),
);

function hasUnrenderedHandlebars(content: string): boolean {
  return HANDLEBARS_RESIDUE.test(content);
}

function find(files: RenderedFile[], path: string): RenderedFile | undefined {
  return files.find((f) => f.path === path);
}

/** Shared correctness net every generated project must pass. */
function describeGeneration(
  label: string,
  files: RenderedFile[],
  registerExtra?: (files: RenderedFile[]) => void,
): void {
  describe(`generateProject: ${label}`, () => {
    it('renders a non-trivial set of files', () => {
      expect(files.length).toBeGreaterThan(20);
    });

    it('writes no empty files (except .gitkeep placeholders)', () => {
      const empty = files
        .filter((f) => f.content.trim() === '' && !f.path.endsWith('.gitkeep'))
        .map((f) => f.path);
      expect(empty).toEqual([]);
    });

    it('produces parseable JSON for every .json output', () => {
      const invalid: string[] = [];
      for (const file of files.filter((f) => f.path.endsWith('.json'))) {
        try {
          JSON.parse(file.content);
        } catch {
          invalid.push(file.path);
        }
      }
      expect(invalid).toEqual([]);
    });

    it('leaves no unrendered Handlebars expressions', () => {
      const leaked = files.filter((f) => hasUnrenderedHandlebars(f.content)).map((f) => f.path);
      expect(leaked).toEqual([]);
    });

    it('matches the generated file manifest', () => {
      expect(files.map((f) => f.path).sort()).toMatchSnapshot();
    });

    it('matches golden output for key files', () => {
      for (const key of ['package.json', 'nx.json', 'CLAUDE.md', '.claude/settings.json']) {
        const file = find(files, key);
        expect(file, `expected ${key} to be generated`).toBeDefined();
        expect(file?.content).toMatchSnapshot(key);
      }
    });

    registerExtra?.(files);
  });
}

for (const preset of presets) {
  describeGeneration(preset.id, generateProject(preset.create(OVERRIDES)));
}

// No preset exercises the .NET stack, so cover it explicitly: dotnet + Postgres
// (EF Core) is the combination that silently failed to wire its data layer.
const dotnetEfConfig: ProjectConfig = {
  ...OVERRIDES,
  teamSize: 'team',
  frontend: { apps: [{ name: 'web', type: 'next-ssr' }] },
  backend: { services: [{ name: 'api', type: 'dotnet' }] },
  mobile: { enabled: false, type: 'none' },
  database: { type: 'postgres' },
  auth: 'custom',
  multiTenancy: 'none',
  apiStyle: 'rest',
  i18n: { enabled: false, locales: [] },
  hosting: 'aws',
  aiLevel: 'full',
  design: { brandHue: 200, personality: 'professional', motionLevel: 'subtle', figmaFileKey: null },
};

describeGeneration('dotnet-ef', generateProject(dotnetEfConfig), (files) => {
  it('compiles the EF Core data layer as a real project', () => {
    const csproj = find(files, 'db/Data.csproj');
    expect(csproj, 'EF Core entities must have a .csproj to compile against').toBeDefined();
    expect(csproj?.content).toContain('Microsoft.EntityFrameworkCore.Design');
    expect(csproj?.content).toContain('<AssemblyName>Acme.Data</AssemblyName>');
  });

  it('references the data project from the API', () => {
    const api = find(files, 'apps/api/api.csproj');
    expect(api?.content).toContain('<ProjectReference Include="../../db/Data.csproj" />');
  });

  it('registers the DbContext in dependency injection', () => {
    const ext = find(files, 'apps/api/Common/Extensions/ServiceExtensions.cs');
    expect(ext?.content).toContain('using Acme.Data;');
    expect(ext?.content).toContain('services.AddDbContext<AppDbContext>');
    expect(ext?.content).toContain('UseNpgsql(configuration.GetConnectionString("DefaultConnection"))');
  });
});
