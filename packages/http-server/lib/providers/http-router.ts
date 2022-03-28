import { Injectable, Type } from '@caviajs/core';
import { Logger } from '@caviajs/logger';
import { match } from 'path-to-regexp';
import { parse } from 'url';
import { ExecutionContext } from '../types/execution-context';
import { Interceptor } from '../types/interceptor';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { Pipe } from '../types/pipe';
import { LOGGER_CONTEXT } from '../http-constants';

@Injectable()
export class HttpRouter {
  protected readonly routes: Route[] = [];

  constructor(
    private readonly logger: Logger,
  ) {
  }

  public add(route: Route): void {
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

  public match(method: Method, url: string): Route | undefined {
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
}

export interface Route {
  controllerConstructor: Type;
  controllerInstance: any;
  controllerInterceptors: { args: any[]; interceptor: Interceptor; }[];
  method: Method;
  path: Path;
  routeHandler: Function;
  routeHandlerInterceptors: { args: any[]; interceptor: Interceptor; }[];
  routeHandlerParams: { data: unknown; factory: (data: unknown, context: ExecutionContext) => any; index: number; }[];
  routeHandlerPipes: { args: any[]; pipe: Pipe; index: number; }[];
}
