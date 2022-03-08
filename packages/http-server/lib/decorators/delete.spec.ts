import { Delete, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Delete', () => {
  it('should return false if the method does not use the @Delete decorator', () => {
    class Foo {
      foo() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'foo')).toEqual([]);
    expect(HttpReflector.hasRouteMetadata(Foo, 'foo')).toEqual(false);
  });

  it('should return the appropriate metadata if the method uses the @Delete decorator', () => {
    class MyInterceptor implements Interceptor {
      intercept(context, next) {
        return next.handle();
      }
    }

    class Foo {
      @Delete()
      fooWithoutArguments() {
      }

      @Delete('foo')
      fooWithPrefix() {
      }

      @Delete(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithInterceptors() {
      }

      @Delete('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithPrefixAndInterceptors() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithoutArguments')).toEqual([{
      interceptors: [],
      method: 'DELETE',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefix')).toEqual([{
      interceptors: [],
      method: 'DELETE',
      path: 'foo',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'DELETE',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefixAndInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'DELETE',
      path: 'foo',
    }]);
  });
});
