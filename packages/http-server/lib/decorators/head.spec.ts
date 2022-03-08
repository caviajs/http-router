import { Head, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

class MyInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

describe('@Head', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadataSpy when the @Head decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Head decorator without any arguments', () => {
    class Foo {
      @Head()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'HEAD',
      path: '',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Head decorator with prefix only', () => {
    class Foo {
      @Head('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'HEAD',
      path: 'foo',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Head decorator with interceptors only', () => {
    class Foo {
      @Head(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'HEAD',
      path: '',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Head decorator with prefix and interceptors', () => {
    class Foo {
      @Head('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'HEAD',
      path: 'foo',
    });
  });
});
