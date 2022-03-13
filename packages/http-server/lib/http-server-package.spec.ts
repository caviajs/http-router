import { HttpServerPackage } from './http-server-package';
import { HttpGlobalPrefixProvider } from './providers/http-global-prefix';
import { HttpGlobalInterceptorsProvider } from './providers/http-global-interceptors';
import { MimeTypeParser } from './providers/mime-type-parser';
import { HttpServerManager } from './providers/http-server-manager';
import { HttpServerProvider } from './providers/http-server';
import { HttpRouterExplorer } from './providers/http-router-explorer';
import { BodyParserInterceptor } from './interceptors/body-parser-interceptor';
import { HttpServerPortProvider } from './providers/http-server-port';
import { HttpRouter } from './providers/http-router';

describe('HttpServerPackage', () => {
  it('should contain built-in providers', () => {
    const httpServerPackage = HttpServerPackage
      .configure()
      .register();

    expect(httpServerPackage.providers.length).toBe(9);
    expect(httpServerPackage.providers).toEqual([
      BodyParserInterceptor,
      HttpRouter,
      HttpRouterExplorer,
      HttpServerProvider,
      HttpServerManager,
      HttpServerPortProvider,
      MimeTypeParser,
      HttpGlobalPrefixProvider,
      HttpGlobalInterceptorsProvider,
    ]);
  });
});
