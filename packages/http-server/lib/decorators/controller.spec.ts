import { Controller, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

class MyInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

describe('@Controller', () => {
  let addControllerMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addControllerMetadataSpy = jest.spyOn(HttpReflector, 'addControllerMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addControllerMetadata when the @Controller decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addControllerMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addControllerMetadata method with the appropriate arguments while using the @Controller decorator without any arguments', () => {
    @Controller()
    class Foo {
    }

    expect(addControllerMetadataSpy).toHaveBeenNthCalledWith(1, Foo, {
      interceptors: [],
      prefix: '',
    });
  });

  it('should execute the addControllerMetadata method with the appropriate arguments while using the @Controller decorator with prefix only', () => {
    @Controller('foo')
    class Foo {
    }

    expect(addControllerMetadataSpy).toHaveBeenNthCalledWith(1, Foo, {
      interceptors: [],
      prefix: 'foo',
    });
  });

  it('should execute the addControllerMetadata method with the appropriate arguments while using the @Controller decorator with interceptors only', () => {
    @Controller(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
    class Foo {
    }

    expect(addControllerMetadataSpy).toHaveBeenNthCalledWith(1, Foo, {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      prefix: '',
    });
  });

  it('should execute the addControllerMetadata method with the appropriate arguments while using the @Controller decorator with prefix and interceptors', () => {
    @Controller('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
    class Foo {
    }

    expect(addControllerMetadataSpy).toHaveBeenNthCalledWith(1, Foo, {
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      prefix: 'foo',
    });
  });
});
