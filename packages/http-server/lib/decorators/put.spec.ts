import { Put, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

class MyInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

describe('@Put', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadata when the @Put decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Put decorator without any arguments', () => {
    class Foo {
      @Put()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'PUT',
      path: '',
    });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Put decorator with prefix only', () => {
    class Foo {
      @Put('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'PUT',
      path: 'foo',
    });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Put decorator with interceptors only', () => {
    class Foo {
      @Put(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'PUT',
      path: '',
    });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Put decorator with prefix and interceptors', () => {
    class Foo {
      @Put('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'PUT',
      path: 'foo',
    });
  });
});
