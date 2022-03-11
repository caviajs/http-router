import { EnvPackage } from './env-package';
import { Env } from './providers/env';
import { EnvPathProvider } from './providers/env-path';

describe('EnvPackage', () => {
  it('should contain built-in providers', () => {
    const envPackage = EnvPackage
      .configure()
      .register();

    expect(envPackage.providers.length).toBe(2);
    expect(envPackage.providers).toEqual([Env, EnvPathProvider]);
  });
});
