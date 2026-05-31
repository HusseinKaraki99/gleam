import { describe, it, expect } from 'vitest';
import { resolveConfig } from '../../src/config/types.js';
import { soloSaasPreset } from '../../src/config/presets/solo-saas.js';
import { teamPlatformPreset } from '../../src/config/presets/team-platform.js';
import { enterprisePreset } from '../../src/config/presets/enterprise.js';
import { fullstackMobilePreset } from '../../src/config/presets/fullstack-mobile.js';

describe('resolveConfig', () => {
  it('resolves solo SaaS preset correctly', () => {
    const config = soloSaasPreset({});
    const resolved = resolveConfig(config);

    expect(resolved.isPolyglot).toBe(false);
    expect(resolved.needsGoWork).toBe(false);
    expect(resolved.needsDocker).toBe(false);
    expect(resolved.backendLanguages).toEqual(new Set(['nestjs']));
    expect(resolved.ormPerService.get('api')).toBe('drizzle');
    expect(resolved.allStackIds).toContain('next-ssr');
    expect(resolved.allStackIds).toContain('nestjs');
    expect(resolved.allStackIds).toContain('postgres');
    expect(resolved.allStackIds).toContain('drizzle');
  });

  it('resolves team platform preset with Go services', () => {
    const config = teamPlatformPreset({});
    const resolved = resolveConfig(config);

    expect(resolved.isPolyglot).toBe(false);
    expect(resolved.needsGoWork).toBe(true);
    expect(resolved.needsDocker).toBe(true);
    expect(resolved.backendLanguages).toEqual(new Set(['go']));
    expect(resolved.ormPerService.get('api')).toBe('sqlc');
    expect(resolved.ormPerService.get('worker')).toBe('sqlc');
  });

  it('resolves enterprise preset as polyglot', () => {
    const config = enterprisePreset({});
    const resolved = resolveConfig(config);

    expect(resolved.isPolyglot).toBe(true);
    expect(resolved.needsGoWork).toBe(true);
    expect(resolved.needsDocker).toBe(true);
    expect(resolved.backendLanguages).toEqual(new Set(['go', 'nestjs']));
    expect(resolved.ormPerService.get('api')).toBe('sqlc');
    expect(resolved.ormPerService.get('notifications')).toBe('drizzle');
    expect(resolved.allStackIds).toContain('expo');
  });

  it('resolves fullstack mobile preset', () => {
    const config = fullstackMobilePreset({});
    const resolved = resolveConfig(config);

    expect(resolved.isPolyglot).toBe(false);
    expect(resolved.needsGoWork).toBe(false);
    expect(resolved.needsDocker).toBe(false);
    expect(resolved.allStackIds).toContain('expo');
    expect(resolved.allStackIds).toContain('nestjs');
  });

  it('deduplicates allStackIds', () => {
    const config = enterprisePreset({});
    const resolved = resolveConfig(config);

    const uniqueIds = new Set(resolved.allStackIds);
    expect(resolved.allStackIds.length).toBe(uniqueIds.size);
  });

  it('applies identity overrides to presets', () => {
    const config = soloSaasPreset({
      name: 'my-app',
      displayName: 'My App',
      org: '@acme',
    });

    expect(config.name).toBe('my-app');
    expect(config.displayName).toBe('My App');
    expect(config.org).toBe('@acme');
  });

  it('handles no-database config', () => {
    const config = soloSaasPreset({});
    config.database.type = 'none';
    config.backend.services = [{ name: 'api', type: 'nestjs' }];

    const resolved = resolveConfig(config);
    expect(resolved.ormPerService.get('api')).toBe('none');
    expect(resolved.allStackIds).not.toContain('postgres');
    expect(resolved.allStackIds).not.toContain('drizzle');
  });
});
