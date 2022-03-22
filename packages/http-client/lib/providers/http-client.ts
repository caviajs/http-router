import { Http } from '@caviajs/common';
import { Injectable } from '@caviajs/core';
import { Readable } from 'stream';

@Injectable()
export class HttpClient {
  public delete(url: string, options?: Options & { responseType: 'buffer'; }): Promise<Response<Buffer>>;
  public delete<T = any>(url: string, options?: Options & { responseType: 'json'; }): Promise<Response<T>>;
  public delete(url: string, options?: Options & { responseType: 'stream'; }): Promise<Response<Readable>>;
  public delete(url: string, options?: Options & { responseType: 'text'; }): Promise<Response<string>>;
  public delete(url: string, options?: Options): Promise<Response<any>> {
    return Http.request({ ...options, method: 'DELETE', url: url });
  }

  public get(url: string, options?: Options & { responseType: 'buffer'; }): Promise<Response<Buffer>>;
  public get<T = any>(url: string, options?: Options & { responseType: 'json'; }): Promise<Response<T>>;
  public get(url: string, options?: Options & { responseType: 'stream'; }): Promise<Response<Readable>>;
  public get(url: string, options?: Options & { responseType: 'text'; }): Promise<Response<string>>;
  public get(url: string, options?: Options): Promise<Response<any>> {
    return Http.request({ ...options, method: 'GET', url: url });
  }

  public patch(url: string, body?: any, options?: Options & { responseType?: 'buffer'; }): Promise<Response<Buffer>>;
  public patch<T = any>(url: string, body?: any, options?: Options & { responseType?: 'json'; }): Promise<Response<T>>;
  public patch(url: string, body?: any, options?: Options & { responseType?: 'stream'; }): Promise<Response<Readable>>;
  public patch(url: string, body?: any, options?: Options & { responseType?: 'text'; }): Promise<Response<string>>;
  public patch(url: string, body?: any, options?: Options): Promise<Response<any>> {
    return Http.request({ ...options, body: body, method: 'PATCH', url: url });
  }

  public post(url: string, body?: any, options?: Options & { responseType?: 'buffer'; }): Promise<Response<Buffer>>;
  public post<T = any>(url: string, body?: any, options?: Options & { responseType?: 'json'; }): Promise<Response<T>>;
  public post(url: string, body?: any, options?: Options & { responseType?: 'stream'; }): Promise<Response<Readable>>;
  public post(url: string, body?: any, options?: Options & { responseType?: 'text'; }): Promise<Response<string>>;
  public post(url: string, body?: any, options?: Options): Promise<Response<any>> {
    return Http.request({ ...options, body: body, method: 'POST', url: url });
  }

  public put(url: string, body?: any, options?: Options & { responseType?: 'buffer'; }): Promise<Response<Buffer>>;
  public put<T = any>(url: string, body?: any, options?: Options & { responseType?: 'json'; }): Promise<Response<T>>;
  public put(url: string, body?: any, options?: Options & { responseType?: 'stream'; }): Promise<Response<Readable>>;
  public put(url: string, body?: any, options?: Options & { responseType?: 'text'; }): Promise<Response<string>>;
  public put(url: string, body?: any, options?: Options): Promise<Response<any>> {
    return Http.request({ ...options, body: body, method: 'PUT', url: url });
  }
}

export interface Options {
  headers?: { [key: string]: string | number };
  params?: { [key: string]: string };
  timeout?: number;
}

export interface Response<T> {
  readonly body: T;
  readonly headers: { readonly [key: string]: string | string[] };
  readonly statusCode: number;
  readonly statusMessage: string;
}
