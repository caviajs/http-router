import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Interceptor } from '../types/interceptor';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { Injectable } from '../decorators/injectable';
import { Logger } from './logger';
import { LOGGER_CONTEXT } from '../constants';
import { Schema } from '../types/schema';

@Injectable()
export class HttpRouter {
  protected readonly httpRoutes: HttpRoute[] = [];

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public find(method: Method, url: string): HttpRoute | undefined {
    let route: HttpRoute | undefined;

    const pathname: string = parse(url).pathname;

    for (const it of this.httpRoutes.filter(r => r.method === method)) {
      if (match(it.path)(pathname)) {
        route = it;
        break;
      }
    }

    return route;
  }

  public push(route: HttpRoute): void {
    if (!route.path.startsWith('/')) {
      route.path = `/${ route.path }`;
    }

    const matcher = match(route.path);

    if (this.httpRoutes.some(it => it.method === route.method && matcher(it.path))) {
      throw new Error(`Duplicated {${ route.path }, ${ route.method }} HTTP route`);
    }

    this.httpRoutes.push(route);
    this.logger.trace(`Mapped {${ route.path }, ${ route.method }} HTTP route`, LOGGER_CONTEXT);
  }
}

export interface HttpRoute {
  controller: any;
  handler: Function;
  interceptors: HttpRouteInterceptor[];
  meta: HttpRouteMeta;
  method: Method;
  path: Path;
}

export interface HttpRouteInterceptor {
  args: any[];
  interceptor: Interceptor;
}

export interface HttpRouteMeta {
  request: {
    body: Schema | undefined;
    cookies: Schema | undefined;
    headers: Schema | undefined;
    params: Schema | undefined;
    query: Schema | undefined;
  };
  responses: {
    [status: number]: {
      content: {
        [mimeType: string]: {
          body: Schema | undefined;
          headers: Schema | undefined;
        };
      };
      description?: string;
    };
  };
}
