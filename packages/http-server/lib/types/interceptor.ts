import { Observable } from 'rxjs';

import { Request } from './request';
import { Response } from './response';

export interface Interceptor<T = any, R = any> {
  intercept(context: InterceptContext, next: Next<T>): Observable<R> | Promise<Observable<R>>;
}

export interface InterceptContext {
  readonly args: any[];
  readonly request: Request;
  readonly response: Response;
  // handler
  // class
}

export interface Next<T = any> {
  handle(): Observable<T>;
}
