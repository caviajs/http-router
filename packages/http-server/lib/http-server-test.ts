import { Http, HttpOptionsBase, HttpResponseBase } from '@caviajs/common';
import { CaviaApplication } from '@caviajs/core';
import http from 'http';
import https from 'https';
import net from 'net';
import { Readable } from 'stream';
import { HTTP_SERVER, HttpServer } from './providers/http-server';
import { Method } from './types/method';
import { Path } from './types/path';

function composeUrl(server: http.Server | https.Server, url: string): string {
  const port = (server.address() as net.AddressInfo)?.port;
  const protocol = server instanceof https.Server ? 'https' : 'http';

  return `${ protocol }://127.0.0.1:${ port }/${ url.replace(/^\//, '') }`;
}

export class HttpServerTest {
  public static async request(caviaApplication: CaviaApplication, method: Method, path: Path, options?: HttpOptions & { responseType?: 'buffer' }): Promise<HttpResponse<Buffer>>;
  public static async request<T = any>(caviaApplication: CaviaApplication, method: Method, path: Path, options?: HttpOptions & { responseType?: 'json' }): Promise<HttpResponse<T>>;
  public static async request(caviaApplication: CaviaApplication, method: Method, path: Path, options?: HttpOptions & { responseType?: 'stream' }): Promise<HttpResponse<Readable>>;
  public static async request(caviaApplication: CaviaApplication, method: Method, path: Path, options?: HttpOptions & { responseType?: 'text' }): Promise<HttpResponse<string>>;
  public static async request(caviaApplication: CaviaApplication, method: Method, path: Path, options?: HttpOptions & { responseType?: any }): Promise<HttpResponse<any>> {
    const server: HttpServer = await caviaApplication.injector.find(HTTP_SERVER);

    if (server.address() === null) {
      server.listen();
    }

    return await Http
      .request({ ...options, method: method, url: composeUrl(server, path) })
      .then(result => {
        server.close();

        return result;
      })
      .catch(error => {
        throw error;
      });
  }
}

export type HttpOptions = Pick<HttpOptionsBase, 'body' | 'headers' | 'params' | 'timeout'>;

export type HttpResponse<T> = HttpResponseBase<T>;
