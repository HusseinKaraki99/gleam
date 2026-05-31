import Handlebars from 'handlebars';
import type { ResolvedConfig } from '../config/types.js';
import type { ComposedProject, ResolvedTemplate } from './composer.js';
import type { TemplateLoader } from './template-loader.js';

// This module is filesystem-free: it reads template source through the injected
// TemplateLoader, so the same renderer runs in Node and in the browser playground.
export function createRenderer(loadTemplate: TemplateLoader): HandlebarsRenderer {
  const hbs = Handlebars.create();
  registerHelpers(hbs);
  return new HandlebarsRenderer(hbs, loadTemplate);
}

export class HandlebarsRenderer {
  private compiledCache = new Map<string, HandlebarsTemplateDelegate>();

  constructor(
    private hbs: typeof Handlebars,
    private loadTemplate: TemplateLoader,
  ) {}

  renderProject(project: ComposedProject, config: ResolvedConfig): RenderedFile[] {
    const files: RenderedFile[] = [];

    for (const tmpl of project.templates) {
      files.push(this.renderTemplate(tmpl, config));
    }

    for (const artifact of project.claudeArtifacts) {
      files.push(this.renderTemplate({
        templatePath: artifact.templatePath,
        outputPath: artifact.outputPath,
        context: { config },
      }, config));
    }

    return files;
  }

  renderTemplate(tmpl: ResolvedTemplate, config: ResolvedConfig): RenderedFile {
    const template = this.getTemplate(tmpl.templatePath);
    const context = {
      ...tmpl.context,
      config,
      project: {
        name: config.name,
        displayName: config.displayName,
        description: config.description,
        org: config.org,
      },
    };

    const content = template(context);
    return { path: tmpl.outputPath, content };
  }

  private getTemplate(templatePath: string): HandlebarsTemplateDelegate {
    const cached = this.compiledCache.get(templatePath);
    if (cached) return cached;

    const source = this.loadTemplate(templatePath);
    const compiled = this.hbs.compile(source, { noEscape: true });
    this.compiledCache.set(templatePath, compiled);
    return compiled;
  }
}

export interface RenderedFile {
  path: string;
  content: string;
}

function registerHelpers(hbs: typeof Handlebars): void {
  hbs.registerHelper('kebabCase', (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  });

  hbs.registerHelper('pascalCase', (str: string) => {
    return str
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  });

  hbs.registerHelper('camelCase', (str: string) => {
    const pascal = str
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  });

  hbs.registerHelper('upperCase', (str: string) => str.toUpperCase());

  hbs.registerHelper('ifEquals', function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper('ifIncludes', function (this: unknown, arr: unknown[], value: unknown, options: Handlebars.HelperOptions) {
    if (Array.isArray(arr) && arr.includes(value)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  hbs.registerHelper('ifHasStack', function (this: unknown, config: ResolvedConfig, stackId: string, options: Handlebars.HelperOptions) {
    if (config.allStackIds.includes(stackId)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  hbs.registerHelper('ifMultiTenancy', function (this: unknown, config: ResolvedConfig, options: Handlebars.HelperOptions) {
    if (config.multiTenancy !== 'none') {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  hbs.registerHelper('ifI18n', function (this: unknown, config: ResolvedConfig, options: Handlebars.HelperOptions) {
    if (config.i18n.enabled) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  hbs.registerHelper('join', (arr: string[], separator: string) => {
    if (Array.isArray(arr)) return arr.join(separator);
    return '';
  });

  hbs.registerHelper('json', (obj: unknown) => {
    return JSON.stringify(obj, null, 2);
  });

  hbs.registerHelper('year', () => new Date().getFullYear());
}
