import { Package, Provider } from '@caviajs/core';
import { BodyParserInterceptor } from './providers/body-parser-interceptor';
import { HttpRouter } from './providers/http-router';
import { HttpRouterManager } from './providers/http-router-manager';
import { HttpServerProvider } from './providers/http-server';
import { HttpServerHandler } from './providers/http-server-handler';
import { HttpServerManager } from './providers/http-server-manager';
import { HttpServerPortProvider } from './providers/http-server-port';
import { MimeTypeParser } from './providers/mime-type-parser';

export class HttpServerPackage {
  public static configure(): HttpServerPackage {
    return new HttpServerPackage();
  }

  protected readonly providers: Provider[] = [
    BodyParserInterceptor,
    HttpRouter,
    HttpRouterManager,
    HttpServerProvider,
    HttpServerHandler,
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
