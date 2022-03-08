import { Options, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Options', () => {
  it('should return false if the method does not use the @Options decorator', () => {
    class Foo {
      foo() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'foo')).toEqual([]);
    expect(HttpReflector.hasRouteMetadata(Foo, 'foo')).toEqual(false);
  });

  it('should return the appropriate metadata if the method uses the @Options decorator', () => {
    class MyInterceptor implements Interceptor {
      intercept(context, next) {
        return next.handle();
      }
    }

    class Foo {
      @Options()
      fooWithoutArguments() {
      }

      @Options('foo')
      fooWithPrefix() {
      }

      @Options(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithInterceptors() {
      }

      @Options('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithPrefixAndInterceptors() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithoutArguments')).toEqual([{
      interceptors: [],
      method: 'OPTIONS',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefix')).toEqual([{
      interceptors: [],
      method: 'OPTIONS',
      path: 'foo',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'OPTIONS',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefixAndInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'OPTIONS',
      path: 'foo',
    }]);
  });
});
