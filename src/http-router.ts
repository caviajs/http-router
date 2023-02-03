import http from 'http';
import { parse as parseUrl } from 'url';
import { Readable } from 'stream';
import { match, MatchResult } from 'path-to-regexp';
import { catchError, defer, EMPTY, firstValueFrom, from, mergeAll, Observable, of, switchMap, tap } from 'rxjs';
import { HttpException } from './http-exception';

export class HttpRouter {
  protected readonly interceptors: Interceptor[] = [];
  protected readonly routes: Route[] = [];

  public get specification(): Specification {
    return {
      routes: this.routes.map(route => ({ metadata: route.metadata, method: route.method, path: route.path })),
    };
  }

  public intercept(interceptor: Interceptor): HttpRouter {
    this.interceptors.push(interceptor);

    return this;
  }

  public route(route: Route): HttpRouter {
    if (route.path.startsWith('/') === false) {
      throw new Error(`The route path in '${ route.method } ${ route.path }' should start with '/'`);
    }

    const matcher = match(route.path);

    if (this.routes.some(it => it.method === route.method && matcher(it.path))) {
      throw new Error(`Duplicated {${ route.method } ${ route.path }} http route`);
    }

    this.routes.push(route);

    return this;
  }

  public async handle(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    const route: Route | undefined = this.findRoute(request.method as RouteMethod, request.url);

    request.metadata = route?.metadata;
    request.params = route ? ((match(route.path)(parseUrl(request.url).pathname) as MatchResult)?.params || {}) as http.Params : {};
    request.path = route?.path;

    const interceptors: Interceptor[] = [...this.interceptors, ...route?.interceptors || []];
    const handler: Promise<unknown> = this.composeHandler(request, response, interceptors, (): Promise<unknown> => {
      if (!route) {
        throw new HttpException(404, 'Route not found');
      }

      return Promise.resolve(route.handler(request, response));
    });

    await firstValueFrom(
      from(handler)
        .pipe(mergeAll())
        .pipe(
          tap((data: any) => {
            this.serialize(response, data);
          }),
          catchError((error: any) => {
            const exception: HttpException = error instanceof HttpException ? error : new HttpException(500);

            response.statusCode = exception.getStatus();

            this.serialize(response, exception.getResponse());

            return of(EMPTY);
          }),
        ),
    );
  }

  protected async composeHandler(request: http.IncomingMessage, response: http.ServerResponse, interceptors: Interceptor[], handler: () => Promise<any>): Promise<any> {
    if (interceptors.length <= 0) {
      return defer(() => from(handler()).pipe(
        switchMap((result: any) => {
          if (result instanceof Promise || result instanceof Observable) {
            return result;
          } else {
            return Promise.resolve(result);
          }
        }),
      ));
    }

    const nextFn = async (index: number) => {
      if (index >= interceptors.length) {
        return defer(() => from(handler()).pipe(
          switchMap((result: any) => {
            if (result instanceof Promise || result instanceof Observable) {
              return result;
            } else {
              return Promise.resolve(result);
            }
          }),
        ));
      }

      return interceptors[index](request, response, {
        handle: () => from(nextFn(index + 1)).pipe(mergeAll()),
      });
    };

    return nextFn(0);
  }

  protected findRoute(method: RouteMethod, url: string): Route | undefined {
    const pathname: string = parseUrl(url).pathname;

    let route: Route | undefined;

    for (const it of this.routes.filter(r => r.method === method)) {
      if (match(it.path)(pathname)) {
        route = it;
        break;
      }
    }

    return route;
  }

  protected async serialize(response: http.ServerResponse, data: any): Promise<void> {
    if (data === undefined) {
      response
        .end();
    } else if (Buffer.isBuffer(data)) {
      response
        .setHeader('Content-Length', data.length)
        .setHeader('Content-Type', response.hasHeader('Content-Type') ? response.getHeader('Content-Type') : 'application/octet-stream')
        .end(data);
    } else if (data instanceof Readable) {
      response
        .setHeader('Content-Type', response.hasHeader('Content-Type') ? response.getHeader('Content-Type') : 'application/octet-stream');

      data
        .pipe(response);
    } else if (typeof data === 'string') {
      response
        .setHeader('Content-Length', Buffer.byteLength(data))
        .setHeader('Content-Type', response.hasHeader('Content-Type') ? response.getHeader('Content-Type') : 'text/plain')
        .end(data);
    } else if (typeof data === 'boolean' || typeof data === 'number' || typeof data === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      const raw: string = JSON.stringify(data);

      response
        .setHeader('Content-Length', Buffer.byteLength(raw))
        .setHeader('Content-Type', response.hasHeader('Content-Type') ? response.getHeader('Content-Type') : 'application/json; charset=utf-8')
        .end(raw);
    } else {
      response
        .end();
    }
  }
}

export interface Interceptor<T = any, R = any> {
  (request: http.IncomingMessage, response: http.ServerResponse, next: Next<T>): Observable<R> | Promise<Observable<R>>;
}

export interface Next<T = any> {
  handle(): Observable<T>;
}

export interface Route {
  readonly handler: RouteHandler;
  readonly interceptors?: Interceptor[];
  readonly metadata?: RouteMetadata;
  readonly method: RouteMethod;
  readonly path: RoutePath;
}

export interface RouteHandler {
  (request: http.IncomingMessage, response: http.ServerResponse): any;
}

export interface RouteMetadata {
  [key: string]: any;
}

export interface Specification {
  routes: SpecificationRoute[];
}

export interface SpecificationRoute {
  readonly metadata?: RouteMetadata;
  readonly method: RouteMethod;
  readonly path: RoutePath;
}

export type RouteMethod = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';

export type RoutePath = string;
