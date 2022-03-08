import { Patch, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Patch', () => {
  it('should return false if the method does not use the @Patch decorator', () => {
    class Foo {
      foo() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'foo')).toEqual([]);
    expect(HttpReflector.hasRouteMetadata(Foo, 'foo')).toEqual(false);
  });

  it('should return the appropriate metadata if the method uses the @Patch decorator', () => {
    class MyInterceptor implements Interceptor {
      intercept(context, next) {
        return next.handle();
      }
    }

    class Foo {
      @Patch()
      fooWithoutArguments() {
      }

      @Patch('foo')
      fooWithPrefix() {
      }

      @Patch(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithInterceptors() {
      }

      @Patch('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
      fooWithPrefixAndInterceptors() {
      }
    }

    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithoutArguments')).toEqual([{
      interceptors: [],
      method: 'PATCH',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefix')).toEqual([{
      interceptors: [],
      method: 'PATCH',
      path: 'foo',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'PATCH',
      path: '',
    }]);
    expect(HttpReflector.getAllRouteMetadata(Foo, 'fooWithPrefixAndInterceptors')).toEqual([{
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }],
      method: 'PATCH',
      path: 'foo',
    }]);
  });
});
