export function resolveConfig(config) {
    const backendLanguages = new Set(config.backend.services.map((s) => s.type));
    const hasGo = backendLanguages.has('go');
    const hasDotnet = backendLanguages.has('dotnet');
    const isPolyglot = backendLanguages.size > 1;
    const ormPerService = new Map();
    for (const service of config.backend.services) {
        if (config.database.type === 'none') {
            ormPerService.set(service.name, 'none');
        }
        else {
            switch (service.type) {
                case 'nestjs':
                    ormPerService.set(service.name, 'drizzle');
                    break;
                case 'go':
                    ormPerService.set(service.name, 'sqlc');
                    break;
                case 'dotnet':
                    ormPerService.set(service.name, 'ef-core');
                    break;
            }
        }
    }
    const allStackIds = [];
    for (const app of config.frontend.apps) {
        allStackIds.push(app.type);
    }
    for (const service of config.backend.services) {
        allStackIds.push(service.type);
    }
    if (config.mobile.enabled) {
        allStackIds.push('expo');
    }
    if (config.database.type !== 'none') {
        allStackIds.push(`${config.database.type}`);
        for (const orm of ormPerService.values()) {
            if (orm !== 'none')
                allStackIds.push(orm);
        }
    }
    return {
        ...config,
        isPolyglot,
        needsGoWork: hasGo,
        needsDocker: hasGo || hasDotnet || config.backend.services.length > 1,
        hasFrontend: config.frontend.apps.length > 0 || config.mobile.enabled,
        backendLanguages,
        ormPerService,
        allStackIds: [...new Set(allStackIds)],
    };
}
//# sourceMappingURL=types.js.map