import Handlebars from 'handlebars';
// This module is filesystem-free: it reads template source through the injected
// TemplateLoader, so the same renderer runs in Node and in the browser playground.
export function createRenderer(loadTemplate) {
    const hbs = Handlebars.create();
    registerHelpers(hbs);
    return new HandlebarsRenderer(hbs, loadTemplate);
}
export class HandlebarsRenderer {
    hbs;
    loadTemplate;
    compiledCache = new Map();
    constructor(hbs, loadTemplate) {
        this.hbs = hbs;
        this.loadTemplate = loadTemplate;
    }
    renderProject(project, config) {
        const files = [];
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
    renderTemplate(tmpl, config) {
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
    getTemplate(templatePath) {
        const cached = this.compiledCache.get(templatePath);
        if (cached)
            return cached;
        const source = this.loadTemplate(templatePath);
        const compiled = this.hbs.compile(source, { noEscape: true });
        this.compiledCache.set(templatePath, compiled);
        return compiled;
    }
}
function registerHelpers(hbs) {
    hbs.registerHelper('kebabCase', (str) => {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    });
    hbs.registerHelper('pascalCase', (str) => {
        return str
            .split(/[-_\s]+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    });
    hbs.registerHelper('camelCase', (str) => {
        const pascal = str
            .split(/[-_\s]+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    });
    hbs.registerHelper('upperCase', (str) => str.toUpperCase());
    hbs.registerHelper('ifEquals', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });
    hbs.registerHelper('ifIncludes', function (arr, value, options) {
        if (Array.isArray(arr) && arr.includes(value)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    hbs.registerHelper('ifHasStack', function (config, stackId, options) {
        if (config.allStackIds.includes(stackId)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    hbs.registerHelper('ifMultiTenancy', function (config, options) {
        if (config.multiTenancy !== 'none') {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    hbs.registerHelper('ifI18n', function (config, options) {
        if (config.i18n.enabled) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    hbs.registerHelper('join', (arr, separator) => {
        if (Array.isArray(arr))
            return arr.join(separator);
        return '';
    });
    hbs.registerHelper('json', (obj) => {
        return JSON.stringify(obj, null, 2);
    });
    hbs.registerHelper('year', () => new Date().getFullYear());
}
//# sourceMappingURL=renderer.js.map