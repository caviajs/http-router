import { Get, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

class MyInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

describe('@Get', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadataSpy when the @Get decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Get decorator without any arguments', () => {
    class Foo {
      @Get()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'GET',
      path: '',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Get decorator with prefix only', () => {
    class Foo {
      @Get('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [],
      method: 'GET',
      path: 'foo',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Get decorator with interceptors only', () => {
    class Foo {
      @Get(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'GET',
      path: '',
    });
  });

  it('should execute the addRouteMetadataSpy method with the appropriate arguments while using the @Get decorator with prefix and interceptors', () => {
    class Foo {
      @Get('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'GET',
      path: 'foo',
    });
  });
});
