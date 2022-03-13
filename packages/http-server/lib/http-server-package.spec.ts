import { HttpServerPackage } from './http-server-package';
import { BodyParserInterceptor } from './providers/body-parser-interceptor';
import { HttpGlobalPrefixProvider } from './providers/http-global-prefix';
import { HttpMetadataScanner } from './providers/http-metadata-scanner';
import { HttpRouter } from './providers/http-router';
import { HttpServerProvider } from './providers/http-server';
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
      HttpGlobalPrefixProvider,
      HttpMetadataScanner,
      HttpRouter,
      HttpServerProvider,
      HttpServerManager,
      HttpServerPortProvider,
      MimeTypeParser,
    ]);
  });
});
