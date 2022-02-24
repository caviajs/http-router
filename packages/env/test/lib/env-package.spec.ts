import { Env, EnvPackage, envPathProvider } from '../../src/public-api';

describe('EnvPackage', () => {
  it('should contain built-in providers', () => {
    const envPackage = EnvPackage
      .configure()
      .register();

    expect(envPackage.providers.length).toBe(2);
    expect(envPackage.providers).toEqual([Env, envPathProvider]);
  });
});
