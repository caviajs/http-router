import { httpRequest, HttpRequestOptions, HttpRequestResult } from '@caviajs/common';
import { Injectable } from '@caviajs/core';
import { Readable } from 'stream';

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

  public patch(url: string, body?: any, options?: Omit<{ responseType?: 'buffer' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<Buffer>>;
  public patch<T = any>(url: string, body?: any, options?: Omit<{ responseType?: 'json' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<T>>;
  public patch(url: string, body?: any, options?: Omit<{ responseType?: 'stream' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<Readable>>;
  public patch(url: string, body?: any, options?: Omit<{ responseType?: 'text' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<string>>;
  public patch(url: string, body?: any, options?: Omit<RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<any>> {
    return this.request({ ...options, body: body, method: 'PATCH', url: url } as any);
  }

  public post(url: string, body?: any, options?: Omit<{ responseType?: 'buffer' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<Buffer>>;
  public post<T = any>(url: string, body?: any, options?: Omit<{ responseType?: 'json' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<T>>;
  public post(url: string, body?: any, options?: Omit<{ responseType?: 'stream' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<Readable>>;
  public post(url: string, body?: any, options?: Omit<{ responseType?: 'text' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<string>>;
  public post(url: string, body?: any, options?: Omit<RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<any>> {
    return this.request({ ...options, body: body, method: 'POST', url: url } as any);
  }

  public put(url: string, body?: any, options?: Omit<{ responseType?: 'buffer' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<Buffer>>;
  public put<T = any>(url: string, body?: any, options?: Omit<{ responseType?: 'json' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<T>>;
  public put(url: string, body?: any, options?: Omit<{ responseType?: 'stream' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<Readable>>;
  public put(url: string, body?: any, options?: Omit<{ responseType?: 'text' } & RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<string>>;
  public put(url: string, body?: any, options?: Omit<RequestOptions, 'body' | 'method' | 'url'>): Promise<RequestResult<any>> {
    return this.request({ ...options, body: body, method: 'PUT', url: url } as any);
  }

  public request(options: { responseType?: 'buffer' } & RequestOptions): Promise<RequestResult<Buffer>>;
  public request<T = any>(options: { responseType?: 'json' } & RequestOptions): Promise<RequestResult<T>>;
  public request(options: { responseType?: 'stream' } & RequestOptions): Promise<RequestResult<Readable>>;
  public request(options: { responseType?: 'text' } & RequestOptions): Promise<RequestResult<string>>;
  public request(options: RequestOptions): Promise<RequestResult<any>> {
    return httpRequest(options as any);
  }
}

export type RequestOptions = HttpRequestOptions;

export type RequestResult<T> = HttpRequestResult<T>;
