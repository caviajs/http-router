import { HttpRouter, HttpRouterExplorer, HttpServerManager, HttpServerPackage, httpServerPortProvider, httpServerProvider } from '../../src/public-api';

describe('HttpServerPackage', () => {
  it('should contain built-in providers', () => {
    const httpServerPackage = HttpServerPackage
      .configure()
      .register();

    expect(httpServerPackage.providers.length).toBe(5);
    expect(httpServerPackage.providers).toEqual([
      HttpRouter,
      HttpRouterExplorer,
      httpServerProvider,
      HttpServerManager,
      httpServerPortProvider,
    ]);
  });
});
