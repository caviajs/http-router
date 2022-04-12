import { Package, Provider } from '@caviajs/core';
import { Body } from './providers/body';
import { Cookies } from './providers/cookies';
import { HttpRouter } from './providers/http-router';
import { HttpRouterManager } from './providers/http-router-manager';
import { HttpServerProvider } from './providers/http-server';
import { HttpServerHandler } from './providers/http-server-handler';
import { HttpServerManager } from './providers/http-server-manager';
import { HttpServerPortProvider } from './providers/http-server-port';
import { MimeType } from './providers/mime-type';
import { Url } from './providers/url';

export class HttpServerPackage {
  public static configure(): HttpServerPackage {
    return new HttpServerPackage();
  }

  protected readonly providers: Provider[] = [
    Body,
    Cookies,
    HttpRouter,
    HttpRouterManager,
    HttpServerProvider,
    HttpServerHandler,
    HttpServerManager,
    HttpServerPortProvider,
    MimeType,
    Url,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
