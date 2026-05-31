import type { StackDefinition } from './types.js';

export const postgresEfStack: StackDefinition = {
  id: 'ef-core',
  name: 'Postgres + EF Core',
  description: 'PostgreSQL with Entity Framework Core for .NET',
  category: 'orm',

  dependencies: {
    nuget: [
      'Microsoft.EntityFrameworkCore',
      'Microsoft.EntityFrameworkCore.Design',
      'Npgsql.EntityFrameworkCore.PostgreSQL',
    ],
  },

  templates: [
    { templatePath: 'db/ef-core/Data.csproj.hbs', outputPath: 'db/Data.csproj' },
    { templatePath: 'db/ef-core/AppDbContext.cs.hbs', outputPath: 'db/AppDbContext.cs' },
    { templatePath: 'db/ef-core/Entities/User.cs.hbs', outputPath: 'db/Entities/User.cs' },
  ],

  configContributions: [],

  claudeArtifacts: [
    { type: 'rule', templatePath: 'claude/rules/database.md.hbs', outputPath: '.claude/rules/database.md' },
  ],

  ciSteps: [],

  scripts: {
    'db:migrate': 'dotnet ef database update --project db/Data.csproj',
    'db:add-migration': 'dotnet ef migrations add --project db/Data.csproj',
  },
};
