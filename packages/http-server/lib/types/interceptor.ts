import { Observable } from 'rxjs';
import { ExecutionContext } from './execution-context';

export interface Interceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: Next<T>): Observable<R> | Promise<Observable<R>>;
}

export interface Next<T = any> {
  handle(): Observable<T>;
}
