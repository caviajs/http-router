import { Injectable, Logger } from '@caviajs/core';
import { Schema } from 'jtd';
import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Interceptor } from '../types/interceptor';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { LOGGER_CONTEXT } from '../http-constants';

@Injectable()
export class HttpRouter {
  protected readonly routes: Route[] = [];

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public find(method: Method, url: string): Route | undefined {
    let route: Route | undefined;

    const pathname: string = parse(url).pathname;

    for (const it of this.routes.filter(r => r.method === method)) {
      if (match(it.path)(pathname)) {
        route = it;
        break;
      }
    }

    return route;
  }

  public push(route: Route): void {
    if (!route.path.startsWith('/')) {
      route.path = `/${ route.path }`;
    }

    const matcher = match(route.path);

    if (this.routes.some(it => it.method === route.method && matcher(it.path))) {
      throw new Error(`Duplicated {${ route.path }, ${ route.method }} HTTP route`);
    }

    this.routes.push(route);
    this.logger.trace(`Mapped {${ route.path }, ${ route.method }} HTTP route`, LOGGER_CONTEXT);
  }
}

export interface Route {
  controller: any;
  handler: Function;
  interceptors: RouteInterceptor[];
  method: Method;
  path: Path;
  schema: {
    requestBody: Schema | undefined;
    requestCookies: Schema | undefined;
    requestHeaders: Schema | undefined;
    requestParams: Schema | undefined;
    requestQuery: Schema | undefined;
    responseBody: Schema | undefined;
    responseHeaders: Schema | undefined;
  };
}

export interface RouteInterceptor {
  args: any[];
  interceptor: Interceptor;
}
