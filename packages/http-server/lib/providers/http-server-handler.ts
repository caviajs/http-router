import { Injectable } from '@caviajs/core';
import { defer, from, mergeAll, Observable, switchMap } from 'rxjs';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { HttpRouter, Route } from './http-router';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { Path } from '../types/path';
import { Interceptor } from '../types/interceptor';
import { HttpException } from '../http-exception';
import { Method } from '../types/method';
import { ExecutionContext } from '../types/execution-context';

declare module 'http' {
  export interface IncomingMessage {
    path: Path;
  }
}

@Injectable()
export class HttpServerHandler {
  constructor(
    private readonly httpRouter: HttpRouter,
  ) {
  }

  public handle(request: Request, response: Response): void {
    const route: Route | undefined = this.httpRouter.find(request.method as Method, request.url);

    const route$ = from(
      this
        .composeInterceptors(
          [/* global interceptors - todo to think about how to inject global interceptors */],
          (): Promise<unknown> => {
            if (!route) {
              throw new HttpException(404, 'Route not found');
            }

            request.path = route.path;

            return this
              .composeInterceptors(
                [...route.controllerInterceptors, ...route.routeHandlerInterceptors].map(it => ({
                  context: {
                    getArgs: () => it.args,
                    getClass: () => route.controllerConstructor,
                    getHandler: () => route.routeHandler,
                    getRequest: () => request,
                    getResponse: () => response,
                  },
                  interceptor: it.interceptor,
                })),
                (): Promise<unknown> => {
                  return Promise.resolve(route.routeHandler.apply(route.controllerInstance, [request, response]));
                },
              );
          },
        ),
    );

    route$
      .pipe(mergeAll())
      .subscribe(
        (result: any) => {
          if (response.writableEnded === false) {
            if (result === undefined) {
              response
                .writeHead(response.statusCode || 204)
                .end();
            } else if (Buffer.isBuffer(result)) {
              response
                .writeHead(response.statusCode, {
                  'Content-Length': response.getHeader('Content-Length') || this.inferenceContentLength(result),
                  'Content-Type': response.getHeader('Content-Type') || this.inferenceContentType(result),
                })
                .end(result);
            } else if (result instanceof Stream || readable(result)) {
              response
                .writeHead(response.statusCode, {
                  'Content-Type': response.getHeader('Content-Type') || this.inferenceContentType(result),
                });

              result.pipe(response);
            } else if (typeof result === 'string') {
              response
                .writeHead(response.statusCode, {
                  'Content-Length': response.getHeader('Content-Length') || this.inferenceContentLength(result),
                  'Content-Type': response.getHeader('Content-Type') || this.inferenceContentType(result),
                })
                .end(result);
            } else if (typeof result === 'boolean' || typeof result === 'number' || typeof result === 'object') {
              // JSON (true, false, number, null, array, object) but without string
              const rawResult = JSON.stringify(result);

              response
                .writeHead(response.statusCode, {
                  'Content-Length': response.getHeader('Content-Length') || this.inferenceContentLength(result),
                  'Content-Type': response.getHeader('Content-Type') || this.inferenceContentType(result),
                })
                .end(rawResult);
            }
          }
        },
        (error: any) => {
          const exception: HttpException = error instanceof HttpException ? error : new HttpException(500);
          const rawResult: any = JSON.stringify(exception.getResponse());

          response
            .writeHead(exception.getStatus(), {
              'Content-Length': this.inferenceContentLength(rawResult),
              'Content-Type': this.inferenceContentType(rawResult),
            })
            .end(rawResult);
        },
      );
  }

  protected async composeInterceptors(
    interceptors: ComposeInterceptor[],
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

      return interceptors[index].interceptor.intercept(interceptors[index].context, {
        handle: () => from(nextFn(index + 1)).pipe(mergeAll()),
      });
    };

    return nextFn(0);
  }

  // public async composePipes(value: any, pipes: ApplyPipe[]): Promise<any> {
  //   return pipes.reduce(async (prev, curr: ApplyPipe) => curr.pipe.transform(await prev, { args: curr.args, metaType: curr.metaType }), Promise.resolve(value));
  // }

  protected inferenceContentLength(result: any): number | undefined {
    if (result === undefined) {
      return undefined;
    } else if (Buffer.isBuffer(result)) {
      return result.length;
    } else if (result instanceof Stream || readable(result)) {
      return undefined;
    } else if (typeof result === 'string') {
      return Buffer.byteLength(result);
    } else if (typeof result === 'boolean' || typeof result === 'number' || typeof result === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      return Buffer.byteLength(JSON.stringify(result));
    }
  }

  protected inferenceContentType(result: any): string | undefined {
    if (result === undefined) {
      return undefined;
    } else if (Buffer.isBuffer(result)) {
      return 'application/octet-stream';
    } else if (result instanceof Stream || readable(result)) {
      return 'application/octet-stream';
    } else if (typeof result === 'string') {
      return 'text/plain';
    } else if (typeof result === 'boolean' || typeof result === 'number' || typeof result === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      return 'application/json; charset=utf-8';
    }
  }
}

export interface ComposeInterceptor {
  context: ExecutionContext;
  interceptor: Interceptor;
}
