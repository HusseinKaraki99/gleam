/**
 * In-memory loader used by the browser playground. The template sources are
 * embedded as data at build time (see scripts/build-template-map.mjs), so the
 * engine needs no filesystem.
 */
export function createMapTemplateLoader(map) {
    return (templatePath) => {
        const source = map[templatePath];
        if (source === undefined) {
            throw new Error(`Template not found in map: ${templatePath}`);
        }
        return source;
    };
}
//# sourceMappingURL=template-loader.js.map