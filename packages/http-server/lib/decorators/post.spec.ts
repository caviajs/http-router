import { Post, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

class MyInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

describe('@Post', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadataSpy when the @Post decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Post decorator without any arguments', () => {
    class Foo {
      @Post()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'POST',
      path: '',
    });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Post decorator with prefix only', () => {
    class Foo {
      @Post('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'POST',
      path: 'foo',
    });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Post decorator with interceptors only', () => {
    class Foo {
      @Post(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'POST',
      path: '',
    });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Post decorator with prefix and interceptors', () => {
    class Foo {
      @Post('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'POST',
      path: 'foo',
    });
  });
});
