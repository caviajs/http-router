import { Observable } from 'rxjs';
import { Request } from './request';
import { Response } from './response';

export abstract class Interceptor<T = any, R = any> {
  public abstract intercept(request: Request, response: Response, next: Next<T>): Observable<R> | Promise<Observable<R>>;
}

export interface Next<T = any> {
  handle(): Observable<T>;
}
