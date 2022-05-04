import { catchError, defer, EMPTY, firstValueFrom, from, mergeAll, Observable, of, switchMap, tap } from 'rxjs';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { Interceptor } from '../types/interceptor';
import { Method } from '../types/method';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpException } from '../exceptions/http-exception';
import { HttpServerRouter } from './http-server-router';
import { OnApplicationBoot } from '../types/hooks';
import { Injector } from '../injector';
import { Injectable } from '../decorators/injectable';
import { Endpoint } from '../types/endpoint';

@Injectable()
export class HttpServerHandler implements OnApplicationBoot {
  protected readonly interceptors: Interceptor[] = [];

  constructor(
    protected readonly httpServerRegistry: HttpServerRouter,
    protected readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    this.interceptors.push(...await this.injector.filter(provider => {
      return typeof provider === 'function' && provider.prototype instanceof Interceptor;
    }));
  }

  public async handle(request: Request, response: Response): Promise<void> {
    const endpoint: Endpoint | undefined = this.httpServerRegistry.resolveEndpoint(request.method as Method, request.url);

    request.metadata = endpoint?.metadata;

    const handler: Promise<unknown> = this.composeInterceptors(request, response, this.interceptors, (): Promise<unknown> => {
      if (!endpoint) {
        throw new HttpException(404, 'Route not found');
      }

      return Promise.resolve(endpoint.handle.apply(endpoint, [request, response]));
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

  protected serialize(response: Response, data: any): void {
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
