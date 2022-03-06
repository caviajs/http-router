import { Package, Provider, Type } from '@caviajs/core';

import { HttpRouter } from './providers/http-router';
import { HttpServerManager } from './providers/http-server-manager';
import { HttpServerProvider } from './providers/http-server';
import { HttpServerPortProvider } from './providers/http-server-port';
import { HttpRouterExplorer } from './providers/http-router-explorer';
import { BodyParserInterceptor } from './interceptors/body-parser-interceptor';
import { MimeTypeParser } from './providers/mime-type-parser';
import { Interceptor } from './types/interceptor';
import { HTTP_GLOBAL_INTERCEPTORS, HttpGlobalInterceptors, HttpGlobalInterceptorsProvider } from './providers/http-global-interceptors';
import { HttpGlobalPrefixProvider } from './providers/http-global-prefix';

export class HttpServerPackage {
  protected readonly global = {
    interceptors: [] as HttpGlobalInterceptors,
  };

  public static configure(): HttpServerPackage {
    return new HttpServerPackage();
  }

  private readonly providers: Provider[] = [
    BodyParserInterceptor,
    HttpRouter,
    HttpRouterExplorer,
    HttpServerProvider,
    HttpServerManager,
    HttpServerPortProvider,
    MimeTypeParser,
    HttpGlobalPrefixProvider,
  ];

  protected constructor() {
  }

  public declareGlobalInterceptor(interceptor: Type<Interceptor>, ...args: any[]): HttpServerPackage {
    this.global.interceptors.push({ args: args, interceptor: interceptor });

    return this;
  }

  public register(): Package {
    if (this.global.interceptors.length >= 1) {
      this.providers.push({
        provide: HTTP_GLOBAL_INTERCEPTORS,
        useValue: this.global.interceptors,
      });
    } else {
      this.providers.push(HttpGlobalInterceptorsProvider);
    }


    return {
      providers: this.providers,
    };
  }
}
