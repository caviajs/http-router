import { Type } from '@caviajs/core';
import { Observable } from 'rxjs';
import { Request } from './request';
import { Response } from './response';

export interface Interceptor<T = any, R = any> {
  intercept(context: InterceptorContext, next: Next<T>): Observable<R> | Promise<Observable<R>>;
}

export interface InterceptorContext {
  getArgs(): any[];

  getClass(): Type;

  getHandler(): Function;

  getRequest(): Request;

  getResponse(): Response;
}

export interface Next<T = any> {
  handle(): Observable<T>;
}
