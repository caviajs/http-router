import { Observable } from 'rxjs';
import { Request } from './request';
import { Response } from './response';
import { Type } from './type';

export abstract class Interceptor<T = any, R = any> {
  public abstract intercept(context: InterceptorContext, next: Next<T>): Observable<R> | Promise<Observable<R>>;
}

export interface InterceptorContext {
  readonly args: any[];
  readonly controller: Type;
  readonly handler: Function;
  readonly request: Request;
  readonly response: Response;
}

export interface Next<T = any> {
  handle(): Observable<T>;
}
