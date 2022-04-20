import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Method } from '../types/method';
import { Injectable } from '../decorators/injectable';
import { Logger } from './logger';
import { LOGGER_CONTEXT } from '../constants';
import { Route } from '../types/route';

@Injectable()
export class HttpRouter {
  public readonly routes: Route[] = []; // todo protected

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public find(method: Method, url: string): Route | undefined {
    let route: Route | undefined;

    const pathname: string = parse(url).pathname;

    for (const it of this.routes.filter(r => r.metadata.method === method)) {
      if (match(it.metadata.path)(pathname)) {
        route = it;
        break;
      }
    }

    return route;
  }

  public push(route: Route): void {
    if (!route.metadata.path.startsWith('/')) {
      throw new Error(`The route path should start with '/'`);
    }

    const matcher = match(route.metadata.path);

    if (this.routes.some(it => it.metadata.method === route.metadata.method && matcher(it.metadata.path))) {
      throw new Error(`Duplicated {${ route.metadata.path }, ${ route.metadata.method }} HTTP route`);
    }

    this.routes.push(route);
    this.logger.trace(`Mapped {${ route.metadata.path }, ${ route.metadata.method }} HTTP route`, LOGGER_CONTEXT);
  }
}
