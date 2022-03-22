import { Http } from '@caviajs/common';
import http from 'http';
import https from 'https';
import { AddressInfo } from 'net';
import { Readable } from 'stream';

function composeUrl(server: http.Server | https.Server, url: string): string {
  const port = (server.address() as AddressInfo).port;
  const protocol = server instanceof https.Server ? 'https' : 'http';

  return `${ protocol }://127.0.0.1:${ port }/${ url.replace(/^\//, '') }`;
}

export class HttpServerTest {
  public static delete(server: http.Server | https.Server, url: string, options?: TestRequestOptions & { responseType?: 'buffer' }): Promise<TestRequestResponse<Buffer>>;
  public static delete<T = any>(server: http.Server | https.Server, url: string, options?: TestRequestOptions & { responseType?: 'json' }): Promise<TestRequestResponse<T>>;
  public static delete(server: http.Server | https.Server, url: string, options?: TestRequestOptions & { responseType?: 'stream' }): Promise<TestRequestResponse<Readable>>;
  public static delete(server: http.Server | https.Server, url: string, options?: TestRequestOptions & { responseType?: 'text' }): Promise<TestRequestResponse<string>>;
  public static delete(server: http.Server | https.Server, url: string, options?: TestRequestOptions): Promise<TestRequestResponse<any>> {
    if (server.address() === null) {
      server.listen();
    }

    return Http
      .request({ ...options, method: 'DELETE', url: composeUrl(server, url) })
      .then(result => {
        server.close();

        return result;
      })
      .catch(error => {
        throw error;
      });
  }

  public static get(server: http.Server | https.Server, url: string, options?: TestRequestOptions & { responseType?: 'buffer' }): Promise<TestRequestResponse<Buffer>>;
  public static get<T = any>(server: http.Server | https.Server, url: string, options?: TestRequestOptions & { responseType?: 'json' }): Promise<TestRequestResponse<T>>;
  public static get(server: http.Server | https.Server, url: string, options?: TestRequestOptions & { responseType?: 'stream' }): Promise<TestRequestResponse<Readable>>;
  public static get(server: http.Server | https.Server, url: string, options?: TestRequestOptions & { responseType?: 'text' }): Promise<TestRequestResponse<string>>;
  public static get(server: http.Server | https.Server, url: string, options?: TestRequestOptions): Promise<TestRequestResponse<any>> {
    if (server.address() === null) {
      server.listen();
    }

    return Http
      .request({ ...options, method: 'GET', url: composeUrl(server, url) })
      .then(result => {
        server.close();

        return result;
      })
      .catch(error => {
        throw error;
      });
  }

  public static patch(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'buffer' }): Promise<TestRequestResponse<Buffer>>;
  public static patch<T = any>(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'json' }): Promise<TestRequestResponse<T>>;
  public static patch(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'stream' }): Promise<TestRequestResponse<Readable>>;
  public static patch(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'text' }): Promise<TestRequestResponse<string>>;
  public static patch(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions): Promise<TestRequestResponse<any>> {
    if (server.address() === null) {
      server.listen();
    }

    return Http
      .request({ ...options, body: body, method: 'PATCH', url: composeUrl(server, url) })
      .then(result => {
        server.close();

        return result;
      })
      .catch(error => {
        throw error;
      });
  }

  public static post(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'buffer' }): Promise<TestRequestResponse<Buffer>>;
  public static post<T = any>(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'json' }): Promise<TestRequestResponse<T>>;
  public static post(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'stream' }): Promise<TestRequestResponse<Readable>>;
  public static post(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'text' }): Promise<TestRequestResponse<string>>;
  public static post(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions): Promise<TestRequestResponse<any>> {
    if (server.address() === null) {
      server.listen();
    }

    return Http
      .request({ ...options, body: body, method: 'POST', url: composeUrl(server, url) })
      .then(result => {
        server.close();

        return result;
      })
      .catch(error => {
        throw error;
      });
  }

  public static put(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'buffer' }): Promise<TestRequestResponse<Buffer>>;
  public static put<T = any>(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'json' }): Promise<TestRequestResponse<T>>;
  public static put(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'stream' }): Promise<TestRequestResponse<Readable>>;
  public static put(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions & { responseType?: 'text' }): Promise<TestRequestResponse<string>>;
  public static put(server: http.Server | https.Server, url: string, body?: any, options?: TestRequestOptions): Promise<TestRequestResponse<any>> {
    if (server.address() === null) {
      server.listen();
    }

    return Http
      .request({ ...options, body: body, method: 'PUT', url: composeUrl(server, url) })
      .then(result => {
        server.close();

        return result;
      })
      .catch(error => {
        throw error;
      });
  }
}

export interface TestRequestOptions {
  headers?: { [key: string]: string | number };
  params?: { [key: string]: string };
  timeout?: number;
}

export interface TestRequestResponse<T> {
  readonly body: T;
  readonly headers: { readonly [key: string]: string | string[] };
  readonly statusCode: number;
  readonly statusMessage: string;
}
