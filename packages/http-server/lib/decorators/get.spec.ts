import { Get, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Get', () => {
  it('should return false if the method does not use the @Get decorator', () => {
    class Foo {
      foo() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'foo')).toEqual([]);
    expect(HttpReflector.hasRouteMetadata(Foo, 'foo')).toEqual(false);
  });

  it('should return the appropriate metadata if the method uses the @Get decorator', () => {
    class MyInterceptor implements Interceptor {
      intercept(context, next) {
        return next.handle();
      }
    }

    class Foo {
      @Get()
      fooWithoutArguments() {
      }

      @Get('foo')
      fooWithPrefix() {
      }

      @Get(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithInterceptors() {
      }

      @Get('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithPrefixAndInterceptors() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithoutArguments')).toEqual([{
      interceptors: [],
      method: 'GET',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefix')).toEqual([{
      interceptors: [],
      method: 'GET',
      path: 'foo',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'GET',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefixAndInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'GET',
      path: 'foo',
    }]);
  });
});
