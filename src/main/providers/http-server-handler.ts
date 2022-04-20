import { defer, from, mergeAll, Observable, switchMap } from 'rxjs';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { parse as urlParse } from 'url';
import { match, MatchResult } from 'path-to-regexp';
import { Interceptor, InterceptorContext } from '../types/interceptor';
import { Method } from '../types/method';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpException } from '../exceptions/http-exception';
import { HttpRouter } from './http-router';
import { OnApplicationBoot } from '../types/hooks';
import { APPLICATION_REF, ApplicationRef } from './application-ref';
import { Injector } from '../injector';
import { Inject } from '../decorators/inject';
import { Injectable } from '../decorators/injectable';
import { getProviderName } from '../utils/get-provider-name';
import { Type } from '../types/type';
import { Route } from '../types/route';

@Injectable()
export class HttpServerHandler implements OnApplicationBoot {
  public interceptors: Interceptor[] = [];

  constructor(
    @Inject(APPLICATION_REF) protected readonly applicationRef: ApplicationRef,
    protected readonly httpRouter: HttpRouter,
    protected readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    this.interceptors = await this
      .injector
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Interceptor);
  }

  public async handle(request: Request, response: Response): Promise<void> {
    const route: Route | undefined = this.httpRouter.find(request.method as Method, request.url);

    request.route = route;
    request.params = route?.metadata.path ? (match(route?.metadata.path)(urlParse(request.url).pathname) as MatchResult)?.params as any : {};

    const route$ = from(
      this
        .composeInterceptors(
          this.interceptors.map(interceptor => ({
            interceptor: interceptor,
            interceptorContext: {
              args: [],
              controller: (route as any)?.prototype?.constructor,
              handler: route?.handle,
              request: request,
              response: response,
            },
          })),
          (): Promise<unknown> => {
            if (!route) {
              throw new HttpException(404, 'Route not found');
            }

            return this
              .composeInterceptors(
                // route.interceptors.map(it => ({
                //   interceptor: it.interceptor,
                //   interceptorContext: {
                //     args: it.args,
                //     controller: route?.controller?.prototype?.constructor,
                //     handler: route?.handler,
                //     request: request,
                //     response: response,
                //   },
                // })),
                [],
                async (): Promise<unknown> => {
                  return Promise.resolve(route.handle.apply(route, [request, response]));
                },
              );
          },
        ),
    );

    route$
      .pipe(mergeAll())
      .subscribe({
        next: (data: any) => {
          console.log('data: ', data);

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
        error: (error: any) => {
          const exception: HttpException = error instanceof HttpException ? error : new HttpException(500);
          const data: any = exception.getResponse();

          response
            .writeHead(exception.getStatus(), {
              'Content-Length': this.inferenceContentLength(data),
              'Content-Type': this.inferenceContentType(data),
            })
            .end(JSON.stringify(data));
        },
      });
  }

  protected async composeInterceptors(interceptors: ComposeInterceptor[], handler: () => Promise<any>): Promise<any> {
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

      return interceptors[index].interceptor.intercept(interceptors[index].interceptorContext, {
        handle: () => from(nextFn(index + 1)).pipe(mergeAll()),
      });
    };

    return nextFn(0);
  }

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
