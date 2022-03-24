import { Http, HttpOptionsBase, HttpResponseBase } from '@caviajs/common';
import http from 'http';
import https from 'https';
import net from 'net';
import { Readable } from 'stream';

function composeUrl(server: http.Server | https.Server, url: string): string {
  const port = (server.address() as net.AddressInfo)?.port;
  const protocol = server instanceof https.Server ? 'https' : 'http';

  return `${ protocol }://127.0.0.1:${ port }/${ url.replace(/^\//, '') }`;
}

export class HttpServerTest {
  public static request(server: http.Server | https.Server, method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT', url: string, options?: HttpOptions & { responseType?: 'buffer' }): Promise<HttpResponse<Buffer>>;
  public static request<T = any>(server: http.Server | https.Server, method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT', url: string, options?: HttpOptions & { responseType?: 'json' }): Promise<HttpResponse<T>>;
  public static request(server: http.Server | https.Server, method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT', url: string, options?: HttpOptions & { responseType?: 'stream' }): Promise<HttpResponse<Readable>>;
  public static request(server: http.Server | https.Server, method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT', url: string, options?: HttpOptions & { responseType?: 'text' }): Promise<HttpResponse<string>>;
  public static request(server: http.Server | https.Server, method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT', url: string, options?: HttpOptions & { responseType?: any }): Promise<HttpResponse<any>> {
    if (server.address() === null) {
      server.listen();
    }

    return Http
      .request({ ...options, method: method, url: composeUrl(server, url) })
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
