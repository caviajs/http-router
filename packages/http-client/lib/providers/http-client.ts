import http from 'http';
import https from 'https';
import { URL } from 'url';
import * as zlib from 'zlib';
import isStream from 'is-stream';
import { Readable } from 'stream';
import { Injectable } from '@caviajs/core';

const DEFAULT_REQUEST_OPTIONS: Partial<RequestOptions> = {
  responseType: 'buffer',
  method: 'GET',
};

@Injectable()
export class HttpClient {
  public delete(url: string, options?: Omit<{ responseType?: 'buffer' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Buffer>>;
  public delete<T = any>(url: string, options?: Omit<{ responseType?: 'json' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<T>>;
  public delete(url: string, options?: Omit<{ responseType?: 'stream' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Readable>>;
  public delete(url: string, options?: Omit<{ responseType?: 'text' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<string>>;
  public delete(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<RequestResult<any>> {
    return this.request({ ...options, method: 'DELETE', url: url } as any);
  }

  public get(url: string, options?: Omit<{ responseType?: 'buffer' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Buffer>>;
  public get<T = any>(url: string, options?: Omit<{ responseType?: 'json' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<T>>;
  public get(url: string, options?: Omit<{ responseType?: 'stream' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Readable>>;
  public get(url: string, options?: Omit<{ responseType?: 'text' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<string>>;
  public get(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<RequestResult<any>> {
    return this.request({ ...options, method: 'GET', url: url } as any);
  }

  public patch(url: string, options?: Omit<{ responseType?: 'buffer' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Buffer>>;
  public patch<T = any>(url: string, options?: Omit<{ responseType?: 'json' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<T>>;
  public patch(url: string, options?: Omit<{ responseType?: 'stream' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Readable>>;
  public patch(url: string, options?: Omit<{ responseType?: 'text' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<string>>;
  public patch(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<RequestResult<any>> {
    return this.request({ ...options, method: 'PATCH', url: url } as any);
  }

  public post(url: string, options?: Omit<{ responseType?: 'buffer' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Buffer>>;
  public post<T = any>(url: string, options?: Omit<{ responseType?: 'json' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<T>>;
  public post(url: string, options?: Omit<{ responseType?: 'stream' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Readable>>;
  public post(url: string, options?: Omit<{ responseType?: 'text' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<string>>;
  public post(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<RequestResult<any>> {
    return this.request({ ...options, method: 'POST', url: url } as any);
  }

  public put(url: string, options?: Omit<{ responseType?: 'buffer' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Buffer>>;
  public put<T = any>(url: string, options?: Omit<{ responseType?: 'json' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<T>>;
  public put(url: string, options?: Omit<{ responseType?: 'stream' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<Readable>>;
  public put(url: string, options?: Omit<{ responseType?: 'text' } & RequestOptions, 'method' | 'url'>): Promise<RequestResult<string>>;
  public put(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<RequestResult<any>> {
    return this.request({ ...options, method: 'PUT', url: url } as any);
  }

  public request(options: { responseType?: 'buffer' } & RequestOptions): Promise<RequestResult<Buffer>>;
  public request<T = any>(options: { responseType?: 'json' } & RequestOptions): Promise<RequestResult<T>>;
  public request(options: { responseType?: 'stream' } & RequestOptions): Promise<RequestResult<Readable>>;
  public request(options: { responseType?: 'text' } & RequestOptions): Promise<RequestResult<string>>;
  public request(options: RequestOptions): Promise<RequestResult<any>> {
    return new Promise<RequestResult<any>>((resolve, reject) => {
      options = {
        body: options.body,
        headers: options.headers,
        params: options.params,
        method: options.method || DEFAULT_REQUEST_OPTIONS.method,
        responseType: options.responseType || DEFAULT_REQUEST_OPTIONS.responseType,
        timeout: options.timeout,
        url: options.url,
      };

      const url = new URL(options.url);

      Object.entries(options?.params || {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      let requestBody;

      if (options.body === undefined) {
        requestBody = undefined;
      } else if (Buffer.isBuffer(options.body)) {
        requestBody = options.body.toString();
      } else if (isStream(options.body)) {
        requestBody = options.body;
      } else if (typeof options.body === 'string') {
        requestBody = options.body.toString();
      } else if (typeof options.body === 'object' || typeof options.body === 'number' || typeof options.body === 'object') {
        // JSON (true, false, number, null, array, object) but without string
        requestBody = JSON.stringify(options.body);
      } else {
        requestBody = (options.body as any).toString();
      }

      const requestOptions: https.RequestOptions = {
        host: url.hostname,
        port: url.port,
        protocol: url.protocol,
        path: `${ url.pathname }${ url.search === null ? '' : url.search }`,
        headers: { ...options.headers },
        timeout: options.timeout,
        method: options.method.toUpperCase(),
      };

      if (!requestOptions.headers['accept-encoding']) {
        requestOptions.headers['accept-encoding'] = 'gzip, deflate';
      }

      if (!requestOptions.headers['Accept']) {
        requestOptions.headers['Accept'] = 'application/json, text/plain, */*';
      }

      if (!requestOptions.headers['Content-Type']) {
        let detectedContentType: string = null;

        if (options.body === null) {
          detectedContentType = null;
        } else if (typeof options.body === 'string') {
          detectedContentType = 'text/plain';
        } else if (typeof options.body === 'object' || typeof options.body === 'number' || Array.isArray(options.body)) {
          detectedContentType = 'application/json;charset=utf-8';
        }

        if (detectedContentType !== null) {
          requestOptions.headers['Content-Type'] = detectedContentType;
        }
      }

      const request = (url.protocol === 'https:' ? https : http).request(requestOptions, (response: http.IncomingMessage) => {
        if (response.headers['content-encoding'] === 'gzip') {
          response.pipe(zlib.createGunzip());
        } else if (response.headers['content-encoding'] === 'deflate') {
          response.pipe(zlib.createInflate());
        }

        if (options.responseType === 'stream') {
          return resolve({
            body: response,
            headers: response.headers,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
          });
        }

        let data: Buffer = Buffer.alloc(0);

        response.on('data', (chunk: Buffer) => {
          data = Buffer.concat([data, chunk]);
        });

        response.on('end', () => {
          let responseBody: any;

          switch (options.responseType) {
            case 'buffer':
              responseBody = data;
              break;
            case 'json':
              responseBody = JSON.parse(data.toString());
              break;
            case 'text':
              responseBody = data.toString();
              break;
          }

          // all http statuses should be treated as resolved (1xx-5xx)
          resolve({
            body: responseBody,
            headers: response.headers,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
          });
        });
      });

      request.on('error', error => {
        // all exceptions (e.g. network errors) should be treated as rejected
        // and caught by a try-catch block
        reject(error);
      });

      if (requestBody) {
        request.write(requestBody);
      }

      request.end();
    });
  }
}

export interface RequestOptions {
  body?: any;
  headers?: { [key: string]: string | number };
  params?: { [key: string]: string };
  method?: 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
  responseType?: 'buffer' | 'json' | 'stream' | 'text';
  timeout?: number;
  url: string;
}

export interface RequestResult<T> {
  readonly body: T;
  readonly headers: { readonly [key: string]: string | string[] };
  readonly statusCode: number;
  readonly statusMessage: string;
}
