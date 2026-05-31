export const dotnetApiStack = {
    id: 'dotnet',
    name: 'ASP.NET Core',
    description: 'ASP.NET Core Web API with feature-based organization',
    category: 'backend',
    dependencies: {
        nuget: [
            'Microsoft.AspNetCore.OpenApi',
            'Microsoft.EntityFrameworkCore',
            'Microsoft.EntityFrameworkCore.Design',
            'Npgsql.EntityFrameworkCore.PostgreSQL',
            'FluentValidation.AspNetCore',
            'Serilog.AspNetCore',
        ],
    },
    templates: [
        { templatePath: 'apps/dotnet-api/project.csproj.hbs', outputPath: 'apps/{{name}}/{{name}}.csproj' },
        { templatePath: 'apps/dotnet-api/Program.cs.hbs', outputPath: 'apps/{{name}}/Program.cs' },
        { templatePath: 'apps/dotnet-api/appsettings.json.hbs', outputPath: 'apps/{{name}}/appsettings.json' },
        { templatePath: 'apps/dotnet-api/appsettings.Development.json.hbs', outputPath: 'apps/{{name}}/appsettings.Development.json' },
        { templatePath: 'apps/dotnet-api/CLAUDE.md.hbs', outputPath: 'apps/{{name}}/CLAUDE.md' },
        { templatePath: 'apps/dotnet-api/Common/Extensions/ServiceExtensions.cs.hbs', outputPath: 'apps/{{name}}/Common/Extensions/ServiceExtensions.cs' },
        { templatePath: 'apps/dotnet-api/Common/Middleware/ExceptionMiddleware.cs.hbs', outputPath: 'apps/{{name}}/Common/Middleware/ExceptionMiddleware.cs' },
        { templatePath: 'apps/dotnet-api/Features/Health/HealthController.cs.hbs', outputPath: 'apps/{{name}}/Features/Health/HealthController.cs' },
    ],
    configContributions: [],
    claudeArtifacts: [
        { type: 'rule', templatePath: 'claude/rules/backend-dotnet.md.hbs', outputPath: '.claude/rules/backend-dotnet.md' },
    ],
    ciSteps: [
        { name: 'build-dotnet', command: 'dotnet build --configuration Release' },
        { name: 'test-dotnet', command: 'dotnet test --configuration Release --no-build' },
    ],
    scripts: {
        'build:dotnet': 'dotnet build --configuration Release',
        'test:dotnet': 'dotnet test --configuration Release',
    },
};
//# sourceMappingURL=dotnet-api.js.map