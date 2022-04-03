import { Http, HttpOptionsBase, HttpResponseBase } from '@caviajs/common';
import { Injectable } from '@caviajs/core';
import { Readable } from 'stream';

@Injectable()
export class HttpClient {
  public delete(url: string, options?: HttpOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public delete<T = any>(url: string, options?: HttpOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public delete(url: string, options?: HttpOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public delete(url: string, options?: HttpOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public delete(url: string, options?: HttpOptions & { responseType?: any }): Promise<HttpResponse<any>> {
    return Http.request({ ...options, method: 'DELETE', url: url });
  }

  public get(url: string, options?: HttpOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public get<T = any>(url: string, options?: HttpOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public get(url: string, options?: HttpOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public get(url: string, options?: HttpOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public get(url: string, options?: HttpOptions & { responseType?: any }): Promise<HttpResponse<any>> {
    return Http.request({ ...options, method: 'GET', url: url });
  }

  public patch(url: string, body?: any, options?: HttpOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public patch<T = any>(url: string, body?: any, options?: HttpOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public patch(url: string, body?: any, options?: HttpOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public patch(url: string, body?: any, options?: HttpOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public patch(url: string, body?: any, options?: HttpOptions & { responseType?: any }): Promise<HttpResponse<any>> {
    return Http.request({ ...options, body: body, method: 'PATCH', url: url });
  }

  public post(url: string, body?: any, options?: HttpOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public post<T = any>(url: string, body?: any, options?: HttpOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public post(url: string, body?: any, options?: HttpOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public post(url: string, body?: any, options?: HttpOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public post(url: string, body?: any, options?: HttpOptions & { responseType?: any }): Promise<HttpResponse<any>> {
    return Http.request({ ...options, body: body, method: 'POST', url: url });
  }

  public put(url: string, body?: any, options?: HttpOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public put<T = any>(url: string, body?: any, options?: HttpOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public put(url: string, body?: any, options?: HttpOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public put(url: string, body?: any, options?: HttpOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public put(url: string, body?: any, options?: HttpOptions & { responseType?: any }): Promise<HttpResponse<any>> {
    return Http.request({ ...options, body: body, method: 'PUT', url: url });
  }
}

export type HttpOptions = Pick<HttpOptionsBase, 'headers' | 'params' | 'timeout'>;

export type HttpResponse<T> = HttpResponseBase<T>;
