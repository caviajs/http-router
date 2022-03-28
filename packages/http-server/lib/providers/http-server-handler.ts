import { Injectable } from '@caviajs/core';
import { HttpRouter } from './http-router';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { Path } from '../types/path';

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

  // this.globalInterceptors = await Promise.all(this.httpGlobalInterceptors.map(async ({ args, interceptor }) => {
  //   const interceptorInstance = await this.injector.find(interceptor);
  //
  //   if (!interceptorInstance) {
  //     throw new Error(`Cavia can't resolve interceptor '${ getProviderName(interceptor) }'`);
  //   }
  //
  //   return { args: args, interceptor: interceptorInstance };
  // }));

  public handle(request: Request, response: Response): void {
  }

  //   const route$ = new Observable(subscriber => {
  //     subscriber.next(1);
  //     subscriber.complete();
  //   });
  //
  //   route$
  //     .pipe(switchMap(() => {
  //       return this.applyInterceptors(
  //         request,
  //         response,
  //         [
  //           ...this.globalInterceptors,
  //         ],
  //         (): Promise<unknown> => {
  //           const route: Route | undefined = this.findRoute(request);
  //
  //           if (!route) {
  //             throw new HttpException(404, 'Route not found');
  //           }
  //
  //           request.path = route.path;
  //
  //           return this.applyInterceptors(
  //             request,
  //             response,
  //             [
  //               ...route.controllerInterceptors,
  //               ...route.routeInterceptors,
  //             ],
  //             (): Promise<unknown> => {
  //               return Promise.resolve(route.routeHandler.apply(route.controllerInstance, [request, response]));
  //             },
  //           );
  //         },
  //       );
  //     }))
  //     .pipe(mergeAll())
  //     .subscribe(
  //       result => {
  //         if (response.writableEnded === false) {
  //           if (result === undefined) {
  //             response
  //               .writeHead(response.statusCode || 204)
  //               .end();
  //           } else if (Buffer.isBuffer(result)) {
  //             response
  //               .writeHead(response.statusCode, {
  //                 'Content-Type': response.getHeader('Content-Type') || 'application/octet-stream',
  //                 'Content-Length': response.getHeader('Content-Length') || result.length,
  //               })
  //               .end(result);
  //           } else if (result instanceof Stream || readable(result)) {
  //             response
  //               .writeHead(response.statusCode, {
  //                 'Content-Type': response.getHeader('Content-Type') || 'application/octet-stream',
  //               });
  //
  //             result.pipe(response);
  //           } else if (typeof result === 'string') {
  //             response
  //               .writeHead(response.statusCode, {
  //                 'Content-Type': response.getHeader('Content-Type') || 'text/plain',
  //                 'Content-Length': response.getHeader('Content-Length') || Buffer.byteLength(result),
  //               })
  //               .end(result);
  //           } else if (typeof result === 'boolean' || typeof result === 'number' || typeof result === 'object') {
  //             // JSON (true, false, number, null, array, object) but without string
  //             const rawJson = JSON.stringify(result);
  //
  //             response
  //               .writeHead(response.statusCode, {
  //                 'Content-Type': response.getHeader('Content-Type') || 'application/json; charset=utf-8',
  //                 'Content-Length': response.getHeader('Content-Length') || Buffer.byteLength(rawJson),
  //               })
  //               .end(rawJson);
  //           }
  //         }
  //       },
  //       (error: any) => {
  //         const exception: HttpException = error instanceof HttpException ? error : new HttpException(500);
  //
  //         response
  //           .writeHead(exception.getStatus(), {
  //             'Content-Type': 'application/json; charset=utf-8',
  //           })
  //           .end(JSON.stringify(exception.getResponse()));
  //       },
  //     );
  // }

  // public async applyInterceptors(
  //   request: Request,
  //   response: Response,
  //   interceptors: RouteInterceptor[],
  //   handler: () => Promise<any>,
  // ): Promise<any> {
  //   if (interceptors.length <= 0) {
  //     return handler();
  //   }
  //
  //   const nextFn = async (index: number) => {
  //     if (index >= interceptors.length) {
  //       return defer(() => from(handler()).pipe(
  //         switchMap((result: any) => {
  //           if (result instanceof Promise || result instanceof Observable) {
  //             return result;
  //           } else {
  //             return Promise.resolve(result);
  //           }
  //         }),
  //       ));
  //     }
  //
  //     return interceptors[index].interceptor.intercept(
  //       {
  //         getArgs: () => interceptors[index].args,
  //         getClass: () => undefined,
  //         getHandler: () => undefined,
  //         getRequest: () => request,
  //         getResponse: () => response,
  //       },
  //       {
  //         handle: () => from(nextFn(index + 1)).pipe(mergeAll()),
  //       },
  //     );
  //   };
  //
  //   return nextFn(0);
  // }

  // public async applyPipes(value: any, pipes: ApplyPipe[]): Promise<any> {
  //   return pipes.reduce(async (prev, curr: ApplyPipe) => curr.pipe.transform(await prev, { args: curr.args, metaType: curr.metaType }), Promise.resolve(value));
  // }
}
