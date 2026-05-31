export const postgresDrizzleStack = {
    id: 'drizzle',
    name: 'Postgres + Drizzle',
    description: 'PostgreSQL with Drizzle ORM for type-safe SQL in Node.js',
    category: 'orm',
    dependencies: {
        npm: [
            { name: 'drizzle-orm', version: '^0.44.0' },
            { name: 'drizzle-zod', version: '^0.7.0' },
            { name: 'postgres', version: '^3.4.0' },
            { name: 'drizzle-kit', version: '^0.31.0', dev: true },
        ],
    },
    templates: [
        { templatePath: 'db/drizzle/drizzle.config.ts.hbs', outputPath: 'db/drizzle.config.ts' },
        { templatePath: 'db/drizzle/package.json.hbs', outputPath: 'db/package.json' },
        { templatePath: 'db/drizzle/schema/index.ts.hbs', outputPath: 'db/schema/index.ts' },
        { templatePath: 'db/drizzle/schema/users.ts.hbs', outputPath: 'db/schema/users.ts' },
        { templatePath: 'db/drizzle/seed.ts.hbs', outputPath: 'db/seed.ts' },
        { templatePath: 'db/drizzle/migrations/.gitkeep', outputPath: 'db/migrations/.gitkeep' },
    ],
    configContributions: [],
    claudeArtifacts: [
        { type: 'rule', templatePath: 'claude/rules/database.md.hbs', outputPath: '.claude/rules/database.md' },
    ],
    ciSteps: [],
    scripts: {
        'db:generate': 'drizzle-kit generate',
        'db:migrate': 'drizzle-kit migrate',
        'db:studio': 'drizzle-kit studio',
        'db:seed': 'tsx db/seed.ts',
    },
};
//# sourceMappingURL=postgres-drizzle.js.map