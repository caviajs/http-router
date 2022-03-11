import { Observable } from 'rxjs';
import { USE_INTERCEPTOR_METADATA, UseInterceptor, UseInterceptorMetadata } from './use-interceptor';
import { ExecutionContext } from '../types/execution-context';
import { Interceptor, Next } from '../types/interceptor';

class FooInterceptor implements Interceptor {
  intercept(context: ExecutionContext, next: Next): Observable<any> {
    return next.handle();
  }
}

class BarInterceptor implements Interceptor {
  intercept(context: ExecutionContext, next: Next): Observable<any> {
    return next.handle();
  }
}

describe('@UseInterceptor', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata when using the decorator on the class', () => {
    @UseInterceptor(BarInterceptor, ['bar'])
    @UseInterceptor(FooInterceptor)
    class Popcorn {
    }

    const useInterceptorMetadata: UseInterceptorMetadata = [
      { args: [], interceptor: FooInterceptor },
      { args: ['bar'], interceptor: BarInterceptor },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(USE_INTERCEPTOR_METADATA, useInterceptorMetadata, Popcorn);
  });

  it('should add the appropriate metadata when using the decorator on the method', () => {
    class Popcorn {
      @UseInterceptor(BarInterceptor, ['bar'])
      @UseInterceptor(FooInterceptor)
      updatePig() {
      }
    }

    const useInterceptorMetadata: UseInterceptorMetadata = [
      { args: [], interceptor: FooInterceptor },
      { args: ['bar'], interceptor: BarInterceptor },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(USE_INTERCEPTOR_METADATA, useInterceptorMetadata, Popcorn, 'updatePig');
  });
});
