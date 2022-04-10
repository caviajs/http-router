import { APPLICATION_REF, ApplicationRef, getProviderName, Inject, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { defer, from, mergeAll, Observable, switchMap } from 'rxjs';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { USE_INTERCEPTOR_METADATA } from '../decorators/use-interceptor';
import { Interceptor, InterceptorContext } from '../types/interceptor';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpRouter, Route } from './http-router';
import { HttpException } from '../http-exception';

declare module 'http' {
  export interface IncomingMessage {
    path: Path;
  }
}

@Injectable()
export class HttpServerHandler implements OnApplicationBoot {
  public globalInterceptors: { args: any[]; interceptor: Interceptor }[] = [];

  constructor(
    @Inject(APPLICATION_REF) private readonly applicationRef: ApplicationRef,
    private readonly httpRouter: HttpRouter,
    private readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    this.globalInterceptors = await Promise.all(
      (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, this.applicationRef.constructor) || [])
        .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
        .reverse()
    );
  }

  public handle(request: Request, response: Response): void {
    const route: Route | undefined = this.httpRouter.find(request.method as Method, request.url);

    const route$ = from(
      this
        .composeInterceptors(
          this.globalInterceptors.map(it => ({
            interceptor: it.interceptor,
            interceptorContext: {
              getArgs: () => it.args,
              getClass: () => route.controllerConstructor,
              getHandler: () => route.routeHandler,
              getRequest: () => request,
              getResponse: () => response,
            },
          })),
          (): Promise<unknown> => {
            if (!route) {
              throw new HttpException(404, 'Route not found');
            }

            request.path = route.path;

            return this
              .composeInterceptors(
                [...route.controllerInterceptors, ...route.routeHandlerInterceptors].map(it => ({
                  interceptor: it.interceptor,
                  interceptorContext: {
                    getArgs: () => it.args,
                    getClass: () => route.controllerConstructor,
                    getHandler: () => route.routeHandler,
                    getRequest: () => request,
                    getResponse: () => response,
                  },
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
        (data: any) => {
          if (response.writableEnded === false) {
            if (data === undefined) {
              response
                .writeHead(response.statusCode || 204)
                .end();
            } else if (Buffer.isBuffer(data)) {
              response
                .writeHead(response.statusCode, {
                  'Content-Length': response.getHeader('Content-Length') || this.inferenceContentLength(data),
                  'Content-Type': response.getHeader('Content-Type') || this.inferenceContentType(data),
                })
                .end(data);
            } else if (data instanceof Stream || readable(data)) {
              response
                .writeHead(response.statusCode, {
                  'Content-Type': response.getHeader('Content-Type') || this.inferenceContentType(data),
                });

              data.pipe(response);
            } else if (typeof data === 'string') {
              response
                .writeHead(response.statusCode, {
                  'Content-Length': response.getHeader('Content-Length') || this.inferenceContentLength(data),
                  'Content-Type': response.getHeader('Content-Type') || this.inferenceContentType(data),
                })
                .end(data);
            } else if (typeof data === 'boolean' || typeof data === 'number' || typeof data === 'object') {
              // JSON (true, false, number, null, array, object) but without string
              response
                .writeHead(response.statusCode, {
                  'Content-Length': response.getHeader('Content-Length') || this.inferenceContentLength(data),
                  'Content-Type': response.getHeader('Content-Type') || this.inferenceContentType(data),
                })
                .end(JSON.stringify(data));
            }
          }
        },
        (error: any) => {
          const exception: HttpException = error instanceof HttpException ? error : new HttpException(500);
          const data: any = exception.getResponse();

          response
            .writeHead(exception.getStatus(), {
              'Content-Length': this.inferenceContentLength(data),
              'Content-Type': this.inferenceContentType(data),
            })
            .end(JSON.stringify(data));
        },
      );
  }

  protected async composeInterceptors(interceptors: ComposeInterceptor[], handler: () => Promise<any>): Promise<any> {
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

      return interceptors[index].interceptor.intercept(interceptors[index].interceptorContext, {
        handle: () => from(nextFn(index + 1)).pipe(mergeAll()),
      });
    };

    return nextFn(0);
  }

  // public async composePipes(value: any, pipes: ApplyPipe[]): Promise<any> {
  //   return pipes.reduce(async (prev, curr: ApplyPipe) => curr.pipe.transform(await prev, { args: curr.args, metaType: curr.metaType }), Promise.resolve(value));
  // }

  protected inferenceContentLength(data: any): number | undefined {
    if (data === undefined) {
      return undefined;
    } else if (Buffer.isBuffer(data)) {
      return data.length;
    } else if (data instanceof Stream || readable(data)) {
      return undefined;
    } else if (typeof data === 'string') {
      return Buffer.byteLength(data);
    } else if (typeof data === 'boolean' || typeof data === 'number' || typeof data === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      return Buffer.byteLength(JSON.stringify(data));
    } else {
      return undefined;
    }
  }

  protected inferenceContentType(data: any): string | undefined {
    if (data === undefined) {
      return undefined;
    } else if (Buffer.isBuffer(data)) {
      return 'application/octet-stream';
    } else if (data instanceof Stream || readable(data)) {
      return 'application/octet-stream';
    } else if (typeof data === 'string') {
      return 'text/plain';
    } else if (typeof data === 'boolean' || typeof data === 'number' || typeof data === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      return 'application/json; charset=utf-8';
    } else {
      return undefined;
    }
  }

  protected async resolveInterceptor(interceptor: Type<Interceptor>): Promise<Interceptor> {
    const instance = await this.injector.find(interceptor);

    if (!instance) {
      throw new Error(`Cavia can't resolve interceptor '${ getProviderName(interceptor) }'`);
    }

    return instance;
  }
}

export interface ComposeInterceptor {
  interceptor: Interceptor;
  interceptorContext: InterceptorContext;
}
