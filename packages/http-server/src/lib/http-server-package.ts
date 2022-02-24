import { Package, Provider, Type } from '@caviajs/core';

import { HttpRouter } from './providers/http-router';
import { HttpServerManager } from './providers/http-server-manager';
import { httpServerProvider } from './providers/http-server';
import { httpServerPortProvider } from './providers/http-server-port';
import { HttpRouterExplorer } from './providers/http-router-explorer';
import { BodyParserInterceptor } from './interceptors/body-parser-interceptor';
import { MimeTypeParser } from './providers/mime-type-parser';
import { Interceptor } from './types/interceptor';
import { createHttpGlobalInterceptorsProvider } from './providers/http-global-interceptors';
import { HttpInterceptorConsumer } from './providers/http-interceptor-consumer';
import { createHttpGlobalPrefixProvider } from './providers/http-global-prefix';

export class HttpServerPackage {
  protected readonly global = {
    interceptors: [],
    prefix: undefined,
  };

  public static configure(): HttpServerPackage {
    return new HttpServerPackage();
  }

  private readonly providers: Provider[] = [
    BodyParserInterceptor,

    HttpInterceptorConsumer,
    HttpRouter,
    HttpRouterExplorer,
    httpServerProvider,
    HttpServerManager,
    httpServerPortProvider,
    MimeTypeParser,
  ];

  protected constructor() {
  }

  public setGlobalPrefix(prefix: string): HttpServerPackage {
    this.global.prefix = prefix;

    return this;
  }

  public declareGlobalInterceptor(interceptor: Type<Interceptor>, ...args: any[]): HttpServerPackage {
    this.global.interceptors.push(interceptor);

    return this;
  }

  public register(): Package {
    this.providers.push(createHttpGlobalInterceptorsProvider(this.global.interceptors));
    this.providers.push(createHttpGlobalPrefixProvider(this.global.prefix));

    return {
      providers: this.providers,
    };
  }
}
