import { Patch, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

class MyInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

describe('@Patch', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadataSpy when the @Patch decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Patch decorator without any arguments', () => {
    class Foo {
      @Patch()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'PATCH',
      path: '',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Patch decorator with prefix only', () => {
    class Foo {
      @Patch('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'PATCH',
      path: 'foo',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Patch decorator with interceptors only', () => {
    class Foo {
      @Patch(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'PATCH',
      path: '',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Patch decorator with prefix and interceptors', () => {
    class Foo {
      @Patch('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'PATCH',
      path: 'foo',
    });
  });
});
