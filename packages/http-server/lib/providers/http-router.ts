import { Injectable, OnApplicationBoot, Type } from '@caviajs/core';
import { Logger } from '@caviajs/logger';
import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { defer, from, Observable, switchMap } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import { HttpException } from '../http-exception';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { Path } from '../types/path';
import { Method } from '../types/method';
import { Interceptor } from '../types/interceptor';
import { Pipe } from '../types/pipe';
import { LOGGER_CONTEXT } from '../http-constants';

declare module 'http' {
  export interface IncomingMessage {
    path: Path;
  }
}

@Injectable()
export class HttpRouter implements OnApplicationBoot {
  protected readonly routes: Route[] = [];
  protected globalInterceptors: RouteInterceptor[] = [];

  constructor(
    private readonly logger: Logger,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    // this.globalInterceptors = await Promise.all(this.httpGlobalInterceptors.map(async ({ args, interceptor }) => {
    //   const interceptorInstance = await this.injector.find(interceptor);
    //
    //   if (!interceptorInstance) {
    //     throw new Error(`Cavia can't resolve interceptor '${ getProviderName(interceptor) }'`);
    //   }
    //
    //   return { args: args, interceptor: interceptorInstance };
    // }));
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

  public handle(request: Request, response: Response): void {
    const route$ = new Observable(subscriber => {
      subscriber.next(1);
      subscriber.complete();
    });

    route$
      .pipe(switchMap(() => {
        return this.applyInterceptors(
          request,
          response,
          [
            ...this.globalInterceptors,
          ],
          (): Promise<unknown> => {
            const route: Route | undefined = this.findRoute(request);

            if (!route) {
              throw new HttpException(404, 'Route not found');
            }

            request.path = route.path;

            return this.applyInterceptors(
              request,
              response,
              [
                ...route.controllerInterceptors,
                ...route.routeInterceptors,
              ],
              (): Promise<unknown> => {
                return Promise.resolve(route.routeHandler.apply(route.controllerInstance, [request, response]));
              },
            );
          },
        );
      }))
      .pipe(mergeAll())
      .subscribe(
        result => {
          if (response.writableEnded === false) {
            if (result === undefined) {
              response
                .writeHead(response.statusCode || 204)
                .end();
            } else if (Buffer.isBuffer(result)) {
              response
                .writeHead(response.statusCode, {
                  'Content-Type': response.getHeader('Content-Type') || 'application/octet-stream',
                  'Content-Length': response.getHeader('Content-Length') || result.length,
                })
                .end(result);
            } else if (result instanceof Stream || readable(result)) {
              response
                .writeHead(response.statusCode, {
                  'Content-Type': response.getHeader('Content-Type') || 'application/octet-stream',
                });

              result.pipe(response);
            } else if (typeof result === 'string') {
              response
                .writeHead(response.statusCode, {
                  'Content-Type': response.getHeader('Content-Type') || 'text/plain',
                  'Content-Length': response.getHeader('Content-Length') || Buffer.byteLength(result),
                })
                .end(result);
            } else if (typeof result === 'boolean' || typeof result === 'number' || typeof result === 'object') {
              // JSON (true, false, number, null, array, object) but without string
              const rawJson = JSON.stringify(result);

              response
                .writeHead(response.statusCode, {
                  'Content-Type': response.getHeader('Content-Type') || 'application/json; charset=utf-8',
                  'Content-Length': response.getHeader('Content-Length') || Buffer.byteLength(rawJson),
                })
                .end(rawJson);
            }
          }
        },
        (error: any) => {
          const exception: HttpException = error instanceof HttpException ? error : new HttpException(500);

          response
            .writeHead(exception.getStatus(), {
              'Content-Type': 'application/json; charset=utf-8',
            })
            .end(JSON.stringify(exception.getResponse()));
        },
      );
  }

  protected findRoute(request: Request): Route | undefined {
    let route: Route | undefined;

    const pathname: string = parse(request.url).pathname;

    for (const it of this.routes.filter(r => r.method === request.method)) {
      if (match(it.path)(pathname)) {
        route = it;
        break;
      }
    }

    return route;
  }

  // public async applyPipes(value: any, pipes: ApplyPipe[]): Promise<any> {
  //   return pipes.reduce(async (prev, curr: ApplyPipe) => curr.pipe.transform(await prev, { args: curr.args, metaType: curr.metaType }), Promise.resolve(value));
  // }

  public async applyInterceptors(
    request: Request,
    response: Response,
    interceptors: RouteInterceptor[],
    handler: () => Promise<any>,
  ): Promise<any> {
    if (interceptors.length <= 0) {
      return handler();
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

      return interceptors[index].interceptor.intercept(
        {
          getArgs: () => interceptors[index].args,
          getClass: () => undefined,
          getHandler: () => undefined,
          getRequest: () => request,
          getResponse: () => response,
        },
        {
          handle: () => from(nextFn(index + 1)).pipe(mergeAll()),
        },
      );
    };

    return nextFn(0);
  }
}

export interface Route {
  controllerConstructor: Type;
  controllerInstance: any;
  controllerInterceptors: RouteInterceptor[];
  routeHandler: Function;
  routeInterceptors: RouteInterceptor[];
  routeParams: RouteParam[];
  method: Method;
  path: Path;
}

export interface RouteParam {
  factory: RouteParamFactory;
  metaType: any;
  pipes: RouteParamPipe[];
}

export interface RouteParamFactory {
  (request: Request, response: Response): any;
}

export interface RouteParamPipe {
  args: any[];
  pipe: Pipe;
}

export interface RouteInterceptor {
  args: any[];
  interceptor: Interceptor;
}
