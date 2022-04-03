import { HttpClient } from './providers/http-client';
import { HttpClientPackage } from './http-client-package';

describe('HttpClientPackage', () => {
  it('should contain built-in providers', () => {
    const httpClientPackage = HttpClientPackage
      .configure()
      .register();

    expect(httpClientPackage.providers.length).toBe(1);
    expect(httpClientPackage.providers).toEqual([HttpClient]);
  });
});
