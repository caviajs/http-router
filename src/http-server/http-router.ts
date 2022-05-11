import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Schema, SchemaObject } from '../validator/schema';
import { HttpException } from './http-exception';
import { catchError, defer, EMPTY, firstValueFrom, from, mergeAll, Observable, of, switchMap, tap } from 'rxjs';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import http from 'http';

export class HttpRouter {
  protected readonly routes: Route[] = [];
  protected readonly interceptors: Interceptor[] = [];

  public get apiSpec(): ApiSpec {
    return {
      endpoints: this.routes.map(endpoint => {
        return { name: endpoint.constructor.name, ...endpoint };
      }),
    };
  }

  public route(method: Method, path: Path, route: Route): void {
    if (!route.path.startsWith('/')) {
      throw new Error(`The path in '${ route.method } ${ route.path }' should start with '/'`);
    }

    const matcher = match(route.path);

    if (this.routes.some(it => it.method === route.method && matcher(it.path))) {
      throw new Error(`Duplicated {${ route.method } ${ route.path }} http endpoint`);
    }

    this.routes.push(route);
  }

  public async handle(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    const route: Route | undefined = this.resolveRoute(request.method as Method, request.url);

    // request.metadata = route?.metadata;

    const handler: Promise<unknown> = this.composeInterceptors(request, response, this.interceptors, (): Promise<unknown> => {
      if (!route) {
        throw new HttpException(404, 'Route not found');
      }

      return Promise.resolve(route.handle(request, response));
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

  protected resolveRoute(method: Method, url: string): Route | undefined {
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

  protected async composeInterceptors(request: http.IncomingMessage, response: http.ServerResponse, interceptors: Interceptor[], handler: () => Promise<any>): Promise<any> {
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

      return interceptors[index].intercept(request, response, {
        handle: () => from(nextFn(index + 1)).pipe(mergeAll()),
      });
    };

    return nextFn(0);
  }

  protected serialize(response: http.ServerResponse, data: any): void {
    if (data === undefined) {
      response
        .writeHead(response.statusCode || 204)
        .end();
    } else if (Buffer.isBuffer(data)) {
      response
        .writeHead(response.statusCode || 200, {
          'Content-Length': response.getHeader('Content-Length') || data.length,
          'Content-Type': response.getHeader('Content-Type') || 'application/octet-stream',
        })
        .end(data);
    } else if (data instanceof Stream || readable(data)) {
      response
        .writeHead(response.statusCode || 200, {
          'Content-Type': response.getHeader('Content-Type') || 'application/octet-stream',
        });

      data.pipe(response);
    } else if (typeof data === 'string') {
      response
        .writeHead(response.statusCode || 200, {
          'Content-Length': response.getHeader('Content-Length') || Buffer.byteLength(data),
          'Content-Type': response.getHeader('Content-Type') || 'text/plain',
        })
        .end(data);
    } else if (typeof data === 'boolean' || typeof data === 'number' || typeof data === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      const raw: string = JSON.stringify(data);

      response
        .writeHead(response.statusCode || 200, {
          'Content-Length': response.getHeader('Content-Length') || Buffer.byteLength(raw),
          'Content-Type': response.getHeader('Content-Type') || 'application/json; charset=utf-8',
        })
        .end(raw);
    }
  }
}

export interface ApiSpec {
  endpoints: ({ name: string } & Route)[];
}

export abstract class Interceptor<T = any, R = any> {
  public abstract intercept(request: http.IncomingMessage, response: http.ServerResponse, next: Next<T>): Observable<R> | Promise<Observable<R>>;
}

export interface Next<T = any> {
  handle(): Observable<T>;
}

export interface Route {
  readonly data?: any;
  readonly method: Method;
  readonly path: string;
  readonly schema?: {
    readonly request?: {
      readonly body?: Schema;
      readonly headers?: SchemaObject;
      readonly params?: SchemaObject;
      readonly query?: SchemaObject;
    };
    readonly responses?: {
      readonly [status: number]: {
        readonly body?: Schema;
        readonly headers?: SchemaObject;
      };
    };
  };

  handle(request: http.IncomingMessage, response: http.ServerResponse): any;
}

export type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';

export type Path = string;
