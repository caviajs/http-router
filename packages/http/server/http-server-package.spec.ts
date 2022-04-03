import { HttpServerPackage } from './http-server-package';
import { BodyParserInterceptor } from './providers/body-parser-interceptor';
import { HttpRouter } from './providers/http-router';
import { HttpRouterManager } from './providers/http-router-manager';
import { HttpServerProvider } from './providers/http-server';
import { HttpServerHandler } from './providers/http-server-handler';
import { HttpServerManager } from './providers/http-server-manager';
import { HttpServerPortProvider } from './providers/http-server-port';
import { MimeTypeParser } from './providers/mime-type-parser';

describe('HttpServerPackage', () => {
  it('should contain built-in providers', () => {
    const httpServerPackage = HttpServerPackage
      .configure()
      .register();

    expect(httpServerPackage.providers.length).toBe(8);
    expect(httpServerPackage.providers).toEqual([
      BodyParserInterceptor,
      HttpRouter,
      HttpRouterManager,
      HttpServerProvider,
      HttpServerHandler,
      HttpServerManager,
      HttpServerPortProvider,
      MimeTypeParser,
    ]);
  });
});
