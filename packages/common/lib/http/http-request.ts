import { Readable } from 'stream';
import { URL } from 'url';
import isStream from 'is-stream';
import https from 'https';
import http from 'http';
import zlib from 'zlib';

const DEFAULT_HTTP_REQUEST_OPTIONS: Partial<HttpRequestOptions> = {
  responseType: 'buffer',
  method: 'GET',
};

export function httpRequest(options: { responseType?: 'buffer' } & HttpRequestOptions): Promise<HttpRequestResult<Buffer>>;
export function httpRequest<T = any>(options: { responseType?: 'json' } & HttpRequestOptions): Promise<HttpRequestResult<T>>;
export function httpRequest(options: { responseType?: 'stream' } & HttpRequestOptions): Promise<HttpRequestResult<Readable>>;
export function httpRequest(options: { responseType?: 'text' } & HttpRequestOptions): Promise<HttpRequestResult<string>>;
export function httpRequest(options: HttpRequestOptions): Promise<HttpRequestResult<any>> {
  return new Promise<HttpRequestResult<any>>((resolve, reject) => {
    options = {
      body: options.body,
      headers: options.headers,
      params: options.params,
      method: options.method || DEFAULT_HTTP_REQUEST_OPTIONS.method,
      responseType: options.responseType || DEFAULT_HTTP_REQUEST_OPTIONS.responseType,
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

export interface HttpRequestOptions {
  body?: any;
  headers?: { [key: string]: string | number };
  params?: { [key: string]: string };
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  responseType?: 'buffer' | 'json' | 'stream' | 'text';
  timeout?: number;
  url: string;
}

export interface HttpRequestResult<T> {
  readonly body: T;
  readonly headers: { readonly [key: string]: string | string[] };
  readonly statusCode: number;
  readonly statusMessage: string;
}
