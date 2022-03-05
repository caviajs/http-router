import { Injectable } from '@caviajs/core';
import { defer, from, Observable } from 'rxjs';
import { mergeAll, switchMap } from 'rxjs/operators';

import { Interceptor } from '../types/interceptor';
import { Request } from '../types/request';
import { Response } from '../types/response';

@Injectable()
export class HttpInterceptorConsumer {
  public async intercept(request: Request, response: Response, interceptors: Interceptor[], handler: () => Promise<any>): Promise<any> {
    if (interceptors.length <= 0) {
      return handler();
    }

    const nextFn = async (index: number) => {
      if (index >= interceptors.length) {
        return defer(() => from(handler()).pipe(
          switchMap((result: any) => {
            if (result instanceof Promise || result instanceof Observable) {
              return result;
            } else {
              return Promise.resolve(result);
            }
          }),
        ));
      }

      return interceptors[index].intercept(request, response, {
        handle: () => from(nextFn(index + 1)).pipe(mergeAll()),
      });
    };

    return nextFn(0);
  }
}
