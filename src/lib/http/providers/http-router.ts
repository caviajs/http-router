import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Interceptor } from '../types/interceptor';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { Injectable } from '../../ioc/decorators/injectable';
import { Logger } from '../../logger/providers/logger';
import { LOGGER_CONTEXT } from '../../constants';
import { Schema } from '../../validator/types/schema';

@Injectable()
export class HttpRouter {
  protected readonly routes: Route[] = [];

  public get specification() {
    return this.routes;
  }

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
  meta: RouteMeta;
  method: Method;
  path: Path;
}

export interface RouteInterceptor {
  args: any[];
  interceptor: Interceptor;
}

export interface RouteMeta {
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
