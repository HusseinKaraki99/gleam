/**
 * A TemplateLoader returns the raw Handlebars source for a template path
 * (e.g. "package.json.hbs"). The renderer depends only on this function, never
 * on a filesystem — so the same render core runs in Node (fs-backed loader) and
 * in the browser playground (in-memory map loader). It must throw if the
 * template is missing; a silently absent template is a generation bug.
 */
export type TemplateLoader = (templatePath: string) => string;
/**
 * In-memory loader used by the browser playground. The template sources are
 * embedded as data at build time (see scripts/build-template-map.mjs), so the
 * engine needs no filesystem.
 */
export declare function createMapTemplateLoader(map: Record<string, string>): TemplateLoader;
//# sourceMappingURL=template-loader.d.ts.map