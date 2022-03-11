import { HttpClientPackage } from './http-client-package';
import { HttpClient } from './providers/http-client';

describe('HttpClientPackage', () => {
  it('should contain built-in providers', () => {
    const httpClientPackage = HttpClientPackage
      .configure()
      .register();

    expect(httpClientPackage.providers.length).toBe(1);
    expect(httpClientPackage.providers).toEqual([HttpClient]);
  });
});
