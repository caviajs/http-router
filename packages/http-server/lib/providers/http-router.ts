import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { Injectable } from '@caviajs/core';
import { Observable, Subscriber, switchMap } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import { HttpException } from '../http-exception';
import { Request } from '../types/request';
import { Response } from '../types/response';

declare module 'http' {
  export interface IncomingMessage {
    path: Path;
  }
}

@Injectable()
export class HttpRouter {
  protected readonly routes: Route[] = [];

  public handle(request: Request, response: Response): void {
    const route$: Observable<Route> = new Observable((subscriber: Subscriber<Route>) => {
      let route: Route | undefined;

      const pathname: string = parse(request.url).pathname;

      for (const it of this.routes.filter(it => it.method === request.method)) {
        if (match(it.path)(pathname)) {
          route = it;
          break;
        }
      }

      if (!route) {
        return subscriber.error(new HttpException(404, 'Route not found'));
      }

      request.path = route.path;

      subscriber.next(route);
      subscriber.complete();
    });

    route$
      .pipe(switchMap(route => {
        return route.handler(request, response);
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

  public route(method: Method, path: Path, handler: Handler): HttpRouter {
    if (!path.startsWith('/')) {
      path = `/${ path }`;
    }

    const matcher = match(path);

    if (this.routes.some(it => it.method === method && matcher(it.path))) {
      throw new Error(`Duplicated {${ path }, ${ method }} HTTP route`);
    }

    this.routes.push({ method, path, handler });

    return this;
  }
}

export interface Handler {
  (request: Request, response: Response): Promise<any>;
}

export interface Route {
  handler: Handler;
  method: Method;
  path: Path;
}

export type Method = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';

export type Path = string;
