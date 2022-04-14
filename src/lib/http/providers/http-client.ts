import { Readable } from 'stream';
import { URL } from 'url';
import isStream from 'is-stream';
import https from 'https';
import http from 'http';
import zlib from 'zlib';
import { Injectable } from '../../ioc/decorators/injectable';

const DEFAULT_HTTP_OPTIONS: Partial<HttpOptions> = {
  responseType: 'buffer',
  method: 'GET',
};

@Injectable()
export class HttpClient {
  public delete(url: string, options?: DeleteOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public delete<T = any>(url: string, options?: DeleteOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public delete(url: string, options?: DeleteOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public delete(url: string, options?: DeleteOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public delete(url: string, options?: DeleteOptions & { responseType?: any; }): Promise<HttpResponse<any>>;
  public delete(url: string, options?: any): Promise<HttpResponse<any>> {
    return this.request({ ...options, method: 'DELETE', url: url });
  }

  public get(url: string, options?: GetOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public get<T = any>(url: string, options?: GetOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public get(url: string, options?: GetOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public get(url: string, options?: GetOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public get(url: string, options?: GetOptions & { responseType?: any; }): Promise<HttpResponse<any>>;
  public get(url: string, options?: any): Promise<HttpResponse<any>> {
    return this.request({ ...options, method: 'GET', url: url });
  }

  public patch(url: string, body?: any, options?: PatchOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public patch<T = any>(url: string, body?: any, options?: PatchOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public patch(url: string, body?: any, options?: PatchOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public patch(url: string, body?: any, options?: PatchOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public patch(url: string, body?: any, options?: PatchOptions & { responseType?: any; }): Promise<HttpResponse<any>>;
  public patch(url: string, body?: any, options?: any): Promise<HttpResponse<any>> {
    return this.request({ ...options, body: body, method: 'PATCH', url: url });
  }

  public post(url: string, body?: any, options?: PostOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public post<T = any>(url: string, body?: any, options?: PostOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public post(url: string, body?: any, options?: PostOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public post(url: string, body?: any, options?: PostOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public post(url: string, body?: any, options?: PostOptions & { responseType?: any; }): Promise<HttpResponse<any>>;
  public post(url: string, body?: any, options?: any): Promise<HttpResponse<any>> {
    return this.request({ ...options, body: body, method: 'POST', url: url });
  }

  public put(url: string, body?: any, options?: PutOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public put<T = any>(url: string, body?: any, options?: PutOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public put(url: string, body?: any, options?: PutOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public put(url: string, body?: any, options?: PutOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public put(url: string, body?: any, options?: PutOptions & { responseType?: any; }): Promise<HttpResponse<any>>;
  public put(url: string, body?: any, options?: any): Promise<HttpResponse<any>> {
    return this.request({ ...options, body: body, method: 'PUT', url: url });
  }

  protected request(options: HttpOptions): Promise<HttpResponse<any>> {
    return new Promise<HttpResponse<any>>((resolve, reject) => {
      options = {
        body: options.body,
        headers: options.headers,
        params: options.params,
        method: options.method || DEFAULT_HTTP_OPTIONS.method,
        responseType: options.responseType || DEFAULT_HTTP_OPTIONS.responseType,
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

export interface HttpOptions {
  body?: any;
  headers?: { [key: string]: string | number };
  params?: { [key: string]: string };
  method?: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
  responseType?: 'buffer' | 'json' | 'stream' | 'text';
  timeout?: number;
  url: string;
}

export interface HttpResponse<T> {
  readonly body: T;
  readonly headers: { readonly [key: string]: string | string[] };
  readonly statusCode: number;
  readonly statusMessage: string;
}

export type DeleteOptions = Pick<HttpOptions, 'headers' | 'params' | 'timeout'>;

export type GetOptions = Pick<HttpOptions, 'headers' | 'params' | 'timeout'>;

export type PatchOptions = Pick<HttpOptions, 'headers' | 'params' | 'timeout'>;

export type PostOptions = Pick<HttpOptions, 'headers' | 'params' | 'timeout'>;

export type PutOptions = Pick<HttpOptions, 'headers' | 'params' | 'timeout'>;
