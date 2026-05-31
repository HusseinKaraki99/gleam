import type { StackDefinition } from './types.js';

export const nestjsStack: StackDefinition = {
  id: 'nestjs',
  name: 'NestJS',
  description: 'NestJS framework for scalable Node.js backend services',
  category: 'backend',

  dependencies: {
    npm: [
      { name: '@nestjs/core', version: '^11.1.0' },
      { name: '@nestjs/common', version: '^11.1.0' },
      { name: '@nestjs/platform-express', version: '^11.1.0' },
      { name: '@nestjs/config', version: '^4.0.0' },
      { name: '@nestjs/swagger', version: '^11.2.0' },
      { name: 'class-validator', version: '^0.14.0' },
      { name: 'class-transformer', version: '^0.5.1' },
      { name: 'zod', version: '^3.24.0' },
      { name: 'reflect-metadata', version: '^0.2.2' },
      { name: 'rxjs', version: '^7.8.0' },
      { name: '@nestjs/cli', version: '^11.0.0', dev: true },
      { name: '@nestjs/testing', version: '^11.1.0', dev: true },
      { name: 'typescript', version: '^5.7.0', dev: true },
      { name: 'vitest', version: '^3.0.0', dev: true },
      { name: 'supertest', version: '^7.1.0', dev: true },
      { name: '@types/supertest', version: '^6.0.0', dev: true },
    ],
  },

  templates: [
    { templatePath: 'apps/nestjs/package.json.hbs', outputPath: 'apps/{{name}}/package.json' },
    { templatePath: 'apps/nestjs/tsconfig.json.hbs', outputPath: 'apps/{{name}}/tsconfig.json' },
    { templatePath: 'apps/nestjs/nest-cli.json.hbs', outputPath: 'apps/{{name}}/nest-cli.json' },
    { templatePath: 'apps/nestjs/CLAUDE.md.hbs', outputPath: 'apps/{{name}}/CLAUDE.md' },
    { templatePath: 'apps/nestjs/src/main.ts.hbs', outputPath: 'apps/{{name}}/src/main.ts' },
    { templatePath: 'apps/nestjs/src/app.module.ts.hbs', outputPath: 'apps/{{name}}/src/app.module.ts' },
    { templatePath: 'apps/nestjs/src/config/env.config.ts.hbs', outputPath: 'apps/{{name}}/src/config/env.config.ts' },
    { templatePath: 'apps/nestjs/src/common/filters/http-exception.filter.ts.hbs', outputPath: 'apps/{{name}}/src/common/filters/http-exception.filter.ts' },
    { templatePath: 'apps/nestjs/src/common/interceptors/transform.interceptor.ts.hbs', outputPath: 'apps/{{name}}/src/common/interceptors/transform.interceptor.ts' },
    { templatePath: 'apps/nestjs/src/health/health.controller.ts.hbs', outputPath: 'apps/{{name}}/src/health/health.controller.ts' },
    { templatePath: 'apps/nestjs/src/health/health.module.ts.hbs', outputPath: 'apps/{{name}}/src/health/health.module.ts' },
    { templatePath: 'apps/nestjs/vitest.config.ts.hbs', outputPath: 'apps/{{name}}/vitest.config.ts' },
  ],

  configContributions: [],

  claudeArtifacts: [
    { type: 'rule', templatePath: 'claude/rules/backend-node.md.hbs', outputPath: '.claude/rules/backend-node.md' },
  ],

  ciSteps: [
    { name: 'test-backend', command: 'nx run-many -t test --projects=tag:scope:backend' },
    { name: 'build-backend', command: 'nx run-many -t build --projects=tag:scope:backend' },
  ],

  nxProjectConfig: {
    tags: ['scope:backend'],
    targets: {
      build: { executor: 'nx:run-commands', options: { command: 'nest build' } },
      dev: { executor: 'nx:run-commands', options: { command: 'nest start --watch' } },
      test: { executor: 'nx:run-commands', options: { command: 'vitest run' } },
    },
  },
};
