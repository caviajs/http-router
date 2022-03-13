import { Package, Provider } from '@caviajs/core';
import { BodyParserInterceptor } from './providers/body-parser-interceptor';
import { HttpGlobalPrefixProvider } from './providers/http-global-prefix';
import { HttpMetadataScanner } from './providers/http-metadata-scanner';
import { HttpRouter } from './providers/http-router';
import { HttpServerProvider } from './providers/http-server';
import { HttpServerManager } from './providers/http-server-manager';
import { HttpServerPortProvider } from './providers/http-server-port';
import { MimeTypeParser } from './providers/mime-type-parser';

export class HttpServerPackage {
  public static configure(): HttpServerPackage {
    return new HttpServerPackage();
  }

  private readonly providers: Provider[] = [
    BodyParserInterceptor,
    HttpGlobalPrefixProvider,
    HttpMetadataScanner,
    HttpRouter,
    HttpServerProvider,
    HttpServerManager,
    HttpServerPortProvider,
    MimeTypeParser,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
