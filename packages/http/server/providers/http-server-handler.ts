import { APPLICATION_REF, ApplicationRef, getProviderName, Inject, Injectable, Injector, OnApplicationBoot, Type, Validator } from '@caviajs/core';
import { defer, from, mergeAll, Observable, switchMap } from 'rxjs';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { USE_INTERCEPTOR_METADATA } from '../decorators/use-interceptor';
import { Interceptor, InterceptorContext } from '../types/interceptor';
import { Method } from '../types/method';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpException } from '../http-exception';
import { Body } from './body';
import { Cookies } from './cookies';
import { HttpRouter, Route } from './http-router';
import { Url } from './url';

@Injectable()
export class HttpServerHandler implements OnApplicationBoot {
  public globalInterceptors: { args: any[]; interceptor: Interceptor }[] = [];

  constructor(
    @Inject(APPLICATION_REF) protected readonly applicationRef: ApplicationRef,
    protected readonly body: Body,
    protected readonly cookies: Cookies,
    protected readonly httpRouter: HttpRouter,
    protected readonly injector: Injector,
    protected readonly url: Url,
    protected readonly validator: Validator,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    this.globalInterceptors = await Promise.all(
      (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, this.applicationRef.constructor) || [])
        .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
        .reverse()
    );
  }

  public async handle(request: Request, response: Response): Promise<void> {
    const route: Route | undefined = this.httpRouter.find(request.method as Method, request.url);

    request.path = route?.path;

    const route$ = from(
      this
        .composeInterceptors(
          [
            {
              interceptor: {
                intercept: async (ctx, next) => {
                  ctx.request.body = await this.body.parseBody(ctx.request);
                  ctx.request.cookies = this.cookies.parseCookies(ctx.request);
                  ctx.request.params = this.url.parseParams(ctx.request.url, route?.path);
                  ctx.request.query = this.url.parseQuery(ctx.request.url);

                  return next.handle();
                },
              },
              interceptorContext: {
                args: [],
                controller: route?.controller?.prototype?.constructor,
                handler: route?.handler,
                request: request,
                response: response,
              },
            },
            ...this.globalInterceptors.map(it => ({
              interceptor: it.interceptor,
              interceptorContext: {
                args: it.args,
                controller: route?.controller?.prototype?.constructor,
                handler: route?.handler,
                request: request,
                response: response,
              },
            }))
          ],
          (): Promise<unknown> => {
            if (!route) {
              throw new HttpException(404, 'Route not found');
            }

            return this
              .composeInterceptors(
                route.interceptors.map(it => ({
                  interceptor: it.interceptor,
                  interceptorContext: {
                    args: it.args,
                    controller: route?.controller?.prototype?.constructor,
                    handler: route?.handler,
                    request: request,
                    response: response,
                  },
                })),
                async (): Promise<unknown> => {
                  const validationErrors = [
                    ...route.requestBodySchema ? this.validator.validate(route.requestBodySchema, request.body).errors : [],
                    ...route.requestCookiesSchema ? this.validator.validate(route.requestCookiesSchema, request.cookies).errors : [],
                    ...route.requestHeadersSchema ? this.validator.validate(route.requestHeadersSchema, request.headers).errors : [],
                    ...route.requestParamsSchema ? this.validator.validate(route.requestParamsSchema, request.params).errors : [],
                    ...route.requestQuerySchema ? this.validator.validate(route.requestQuerySchema, request.query).errors : [],
                  ];

                  if (validationErrors.length) {
                    throw new HttpException(400, validationErrors);
                  }

                  return Promise.resolve(route.handler.apply(route.controller, [request, response]));
                },
              );
          },
        ),
    );

    route$
      .pipe(mergeAll())
      .subscribe({
        next: (data: any) => {
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
