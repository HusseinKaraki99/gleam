import Handlebars from 'handlebars';
import type { ResolvedConfig } from '../config/types.js';
import type { ComposedProject, ResolvedTemplate } from './composer.js';
import type { TemplateLoader } from './template-loader.js';
export declare function createRenderer(loadTemplate: TemplateLoader): HandlebarsRenderer;
export declare class HandlebarsRenderer {
    private hbs;
    private loadTemplate;
    private compiledCache;
    constructor(hbs: typeof Handlebars, loadTemplate: TemplateLoader);
    renderProject(project: ComposedProject, config: ResolvedConfig): RenderedFile[];
    renderTemplate(tmpl: ResolvedTemplate, config: ResolvedConfig): RenderedFile;
    private getTemplate;
}
export interface RenderedFile {
    path: string;
    content: string;
}
//# sourceMappingURL=renderer.d.ts.map