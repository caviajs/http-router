import { Controller, ControllerOptions, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

class MyInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

const controllerOptions: ControllerOptions = {
  interceptors: [MyInterceptor, { args: ['bar'], interceptor: MyInterceptor }],
};

@Controller()
class FooWithoutArguments {
}

@Controller('foo')
class FooWithPrefix {
}

@Controller(controllerOptions)
class FooWithOptions {
}

@Controller('foo', controllerOptions)
class FooWithPrefixAndOptions {
}

describe('@Controller', () => {
  it('should return false if the class does not use the @Controller decorator', () => {
    class Foo {
    }

    expect(HttpReflector.getAllControllerMetadata(Foo)).toEqual([]);
    expect(HttpReflector.hasControllerMetadata(Foo)).toEqual(false);
  });

  it('should return the appropriate metadata if the class uses the @Controller decorator', () => {
    expect(HttpReflector.getAllControllerMetadata(FooWithoutArguments)).toEqual([{ prefix: '', interceptors: [] }]);
    expect(HttpReflector.getAllControllerMetadata(FooWithPrefix)).toEqual([{ prefix: 'foo', interceptors: [] }]);
    expect(HttpReflector.getAllControllerMetadata(FooWithOptions)).toEqual([{ prefix: '', interceptors: controllerOptions.interceptors }]);
    expect(HttpReflector.getAllControllerMetadata(FooWithPrefixAndOptions)).toEqual([{ prefix: 'foo', interceptors: controllerOptions.interceptors }]);
  });
});
