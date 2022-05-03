import { defer, from, mergeAll, Observable, switchMap } from 'rxjs';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { parse as urlParse } from 'url';
import { match, MatchResult } from 'path-to-regexp';
import { Interceptor } from '../types/interceptor';
import { Method } from '../types/method';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpException } from '../exceptions/http-exception';
import { HttpServerRegistry } from './http-server-registry';
import { OnApplicationBoot } from '../types/hooks';
import { Injector } from '../injector';
import { Injectable } from '../decorators/injectable';
import { Endpoint } from '../types/endpoint';

@Injectable()
export class HttpServerHandler implements OnApplicationBoot {
  protected readonly interceptors: Interceptor[] = [];

  constructor(
    protected readonly httpServerRegistry: HttpServerRegistry,
    protected readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    this.interceptors.push(...await this.injector.filter(provider => {
      return typeof provider === 'function' && provider.prototype instanceof Interceptor;
    }));
  }

  public async handle(request: Request, response: Response): Promise<void> {
    const endpoint: Endpoint | undefined = this.httpServerRegistry.find(request.method as Method, request.url);

    request.metadata = endpoint?.metadata;
    request.params = endpoint?.metadata.path ? (match(endpoint?.metadata.path)(urlParse(request.url).pathname) as MatchResult)?.params as any : {};

    const route$ = from(this.composeInterceptors(request, response, this.interceptors, (): Promise<unknown> => {
      if (!endpoint) {
        throw new HttpException(404, 'Route not found');
      }

      return Promise.resolve(endpoint.handle.apply(endpoint, [request, response]));
    }));

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

  protected async composeInterceptors(request: Request, response: Response, interceptors: Interceptor[], handler: () => Promise<any>): Promise<any> {
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
}
