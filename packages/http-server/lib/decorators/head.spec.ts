import { Head, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Head', () => {
  it('should return false if the method does not use the @Head decorator', () => {
    class Foo {
      foo() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'foo')).toEqual([]);
    expect(HttpReflector.hasRouteMetadata(Foo, 'foo')).toEqual(false);
  });

  it('should return the appropriate metadata if the method uses the @Head decorator', () => {
    class MyInterceptor implements Interceptor {
      intercept(context, next) {
        return next.handle();
      }
    }

    class Foo {
      @Head()
      fooWithoutArguments() {
      }

      @Head('foo')
      fooWithPrefix() {
      }

      @Head(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithInterceptors() {
      }

      @Head('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithPrefixAndInterceptors() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithoutArguments')).toEqual([{
      interceptors: [],
      method: 'HEAD',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefix')).toEqual([{
      interceptors: [],
      method: 'HEAD',
      path: 'foo',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'HEAD',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefixAndInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'HEAD',
      path: 'foo',
    }]);
  });
});
