export const postgresSqlcStack = {
    id: 'sqlc',
    name: 'Postgres + sqlc',
    description: 'PostgreSQL with sqlc for type-safe SQL in Go',
    category: 'orm',
    dependencies: {
        goModules: [
            'github.com/jackc/pgx/v5',
        ],
    },
    templates: [
        { templatePath: 'db/sqlc/sqlc.yaml.hbs', outputPath: 'db/sqlc.yaml' },
        { templatePath: 'db/sqlc/queries/users.sql.hbs', outputPath: 'db/queries/users.sql' },
        { templatePath: 'db/sqlc/migrations/00001_initial.sql.hbs', outputPath: 'db/migrations/00001_initial.sql' },
        { templatePath: 'db/sqlc/generated/.gitkeep', outputPath: 'db/generated/.gitkeep' },
    ],
    configContributions: [],
    claudeArtifacts: [
        { type: 'rule', templatePath: 'claude/rules/database.md.hbs', outputPath: '.claude/rules/database.md' },
    ],
    ciSteps: [
        { name: 'sqlc-vet', command: 'sqlc vet' },
    ],
    scripts: {
        'db:generate': 'sqlc generate',
        'db:migrate': 'goose -dir db/migrations postgres "$DATABASE_URL" up',
        'db:create-migration': 'goose -dir db/migrations create',
    },
};
//# sourceMappingURL=postgres-sqlc.js.map