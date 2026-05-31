export const goServiceStack = {
    id: 'go',
    name: 'Go Service',
    description: 'Go hexagonal service with Chi router and structured logging',
    category: 'backend',
    dependencies: {
        goModules: [
            'github.com/go-chi/chi/v5',
            'github.com/go-chi/cors',
            'github.com/rs/zerolog',
            'github.com/jackc/pgx/v5',
            'github.com/google/uuid',
            'github.com/stretchr/testify',
        ],
    },
    templates: [
        { templatePath: 'services/go-service/go.mod.hbs', outputPath: 'services/{{name}}/go.mod' },
        { templatePath: 'services/go-service/service.go.hbs', outputPath: 'services/{{name}}/service.go' },
        { templatePath: 'services/go-service/service_test.go.hbs', outputPath: 'services/{{name}}/service_test.go' },
        { templatePath: 'services/go-service/domain/models.go.hbs', outputPath: 'services/{{name}}/domain/models.go' },
        { templatePath: 'services/go-service/domain/errors.go.hbs', outputPath: 'services/{{name}}/domain/errors.go' },
        { templatePath: 'services/go-service/ports/repository.go.hbs', outputPath: 'services/{{name}}/ports/repository.go' },
        { templatePath: 'services/go-service/usecase/usecase.go.hbs', outputPath: 'services/{{name}}/usecase/usecase.go' },
        { templatePath: 'services/go-service/adapters/http/handler.go.hbs', outputPath: 'services/{{name}}/adapters/http/handler.go' },
        { templatePath: 'services/go-service/adapters/postgres/repository.go.hbs', outputPath: 'services/{{name}}/adapters/postgres/repository.go' },
    ],
    configContributions: [],
    claudeArtifacts: [
        { type: 'rule', templatePath: 'claude/rules/backend-go.md.hbs', outputPath: '.claude/rules/backend-go.md' },
        { type: 'agent', templatePath: 'claude/agents/go-expert.md.hbs', outputPath: '.claude/agents/go-expert.md' },
    ],
    ciSteps: [
        { name: 'lint-go', command: 'golangci-lint run ./...' },
        { name: 'test-go', command: 'go test ./... -v -race -coverprofile=coverage.out' },
        { name: 'build-go', command: 'go build ./...' },
    ],
    scripts: {
        'lint:go': 'golangci-lint run ./...',
        'test:go': 'go test ./... -v -race',
        'build:go': 'go build ./...',
    },
};
//# sourceMappingURL=go-service.js.map