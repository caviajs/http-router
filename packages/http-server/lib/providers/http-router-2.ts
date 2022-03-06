import { Logger } from '@caviajs/logger';
import { Injectable } from '@caviajs/core';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { Interceptor } from '../types/interceptor';
import { Pipe } from '../types/pipe';
import { match } from 'path-to-regexp';
import { LOGGER_CONTEXT } from '../http-constants';
import { Request } from '../types/request';
import { Response } from '../types/response';

@Injectable()
export class HttpRouter2 {
  protected readonly routes: Route[] = [];

  constructor(
    private readonly logger: Logger,
  ) {
  }

  public handle(): void {
    //
  }

  public addRoute(route: Route): void {
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
  controllerConstructor: Function;
  controllerInstance: any;
  controllerInterceptors: { args: any[]; interceptor: Interceptor; }[];
  globalInterceptors: { args: any[]; interceptor: Interceptor; }[];
  handler: (...args: any[]) => any;
  handlerParams: {
    factory: (request: Request, response: Response) => any;
    index: number;
    pipes: { args: any[]; metaType: any; pipe: Pipe; }[];
  }[];
  method: Method;
  path: Path;
  routeInterceptors: { args: any[]; interceptor: Interceptor; }[];
}
