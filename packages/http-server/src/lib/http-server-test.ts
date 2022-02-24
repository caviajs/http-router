import { HttpClient } from '@caviajs/http-client';
import http from 'http';
import https from 'https';
import { AddressInfo } from 'net';
import { Readable } from 'stream';

export class HttpServerTest {
  public static delete(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'buffer' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Buffer>>;
  public static delete<T = any>(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'json' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<T>>;
  public static delete(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'stream' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Readable>>;
  public static delete(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'text' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<string>>;
  public static delete(server: http.Server | https.Server, url: string, options?: Omit<TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<any>> {
    return this.request(server, { ...options, method: 'DELETE', url: url } as any);
  }

  public static get(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'buffer' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Buffer>>;
  public static get<T = any>(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'json' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<T>>;
  public static get(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'stream' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Readable>>;
  public static get(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'text' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<string>>;
  public static get(server: http.Server | https.Server, url: string, options?: Omit<TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<any>> {
    return this.request(server, { ...options, method: 'GET', url: url } as any);
  }

  public static patch(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'buffer' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Buffer>>;
  public static patch<T = any>(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'json' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<T>>;
  public static patch(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'stream' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Readable>>;
  public static patch(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'text' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<string>>;
  public static patch(server: http.Server | https.Server, url: string, options?: Omit<TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<any>> {
    return this.request(server, { ...options, method: 'PATCH', url: url } as any);
  }

  public static post(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'buffer' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Buffer>>;
  public static post<T = any>(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'json' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<T>>;
  public static post(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'stream' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Readable>>;
  public static post(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'text' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<string>>;
  public static post(server: http.Server | https.Server, url: string, options?: Omit<TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<any>> {
    return this.request(server, { ...options, method: 'POST', url: url } as any);
  }

  public static put(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'buffer' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Buffer>>;
  public static put<T = any>(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'json' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<T>>;
  public static put(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'stream' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<Readable>>;
  public static put(server: http.Server | https.Server, url: string, options?: Omit<{ responseType?: 'text' } & TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<string>>;
  public static put(server: http.Server | https.Server, url: string, options?: Omit<TestRequestOptions, 'method' | 'url'>): Promise<TestRequestResult<any>> {
    return this.request(server, { ...options, method: 'PUT', url: url } as any);
  }

  public static async request(server: http.Server | https.Server, options: { responseType?: 'buffer' } & TestRequestOptions): Promise<TestRequestResult<Buffer>>;
  public static async request<T>(server: http.Server | https.Server, options: { responseType?: 'json' } & TestRequestOptions): Promise<TestRequestResult<T>>;
  public static async request(server: http.Server | https.Server, options: { responseType?: 'stream' } & TestRequestOptions): Promise<TestRequestResult<Readable>>;
  public static async request(server: http.Server | https.Server, options: { responseType?: 'text' } & TestRequestOptions): Promise<TestRequestResult<string>>;
  public static async request(server: http.Server | https.Server, options: TestRequestOptions): Promise<TestRequestResult<any>> {
    if (server.address() === null) {
      server.listen();
    }

    const port = (server.address() as AddressInfo).port;
    const protocol = server instanceof https.Server ? 'https' : 'http';

    return this
      .httpClient
      .request({
        body: options.body,
        headers: options.headers,
        params: options.params,
        method: options.method,
        responseType: options.responseType as any,
        timeout: options.timeout,
        url: `${ protocol }://127.0.0.1:${ port }/${ options.url.replace(/^\//, '') }`,
      })
      .then(result => {
        server.close();

        return {
          body: result.body,
          headers: result.headers,
          statusCode: result.statusCode,
          statusMessage: result.statusMessage,
        };
      })
      .catch(error => {
        throw error;
      });
  }

  protected static httpClient = new HttpClient();
}

export interface TestRequestOptions {
  body?: any;
  headers?: { [key: string]: string | number };
  params?: { [key: string]: string };
  method?: 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
  responseType?: 'buffer' | 'json' | 'stream' | 'text';
  timeout?: number;
  url: string;
}

export interface TestRequestResult<T> {
  readonly body: T;
  readonly headers: { readonly [key: string]: string | string[] };
  readonly statusCode: number;
  readonly statusMessage: string;
}
