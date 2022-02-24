import { HttpClient, HttpClientPackage } from '../../src/public-api';

describe('HttpClientPackage', () => {
  it('should contain built-in providers', () => {
    const httpClientPackage = HttpClientPackage
      .configure()
      .register();

    expect(httpClientPackage.providers.length).toBe(1);
    expect(httpClientPackage.providers).toEqual([HttpClient]);
  });
});
