import { Controller, ControllerMetadata, ControllerOptions, getControllerMetadata, hasControllerMetadata, Interceptor } from '@caviajs/http-server';

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

    expect(getControllerMetadata(Foo)).toEqual(undefined);
    expect(hasControllerMetadata(Foo)).toEqual(false);
  });

  it('should return the appropriate metadata if the class uses the @Controller decorator', () => {
    const fooWithoutArgumentsMeta: ControllerMetadata = getControllerMetadata(FooWithoutArguments);
    const fooWithPrefixMeta: ControllerMetadata = getControllerMetadata(FooWithPrefix);
    const fooWithOptionsMeta: ControllerMetadata = getControllerMetadata(FooWithOptions);
    const fooWithPrefixAndOptionsMeta: ControllerMetadata = getControllerMetadata(FooWithPrefixAndOptions);

    expect(fooWithoutArgumentsMeta.prefix).toBeUndefined();
    expect(fooWithoutArgumentsMeta.interceptors).toBeUndefined();

    expect(fooWithPrefixMeta.prefix).toEqual('foo');
    expect(fooWithPrefixMeta.interceptors).toBeUndefined();

    expect(fooWithOptionsMeta.prefix).toBeUndefined();
    expect(fooWithOptionsMeta.interceptors).toEqual(controllerOptions.interceptors);

    expect(fooWithPrefixAndOptionsMeta.prefix).toEqual('foo');
    expect(fooWithPrefixAndOptionsMeta.interceptors).toEqual(controllerOptions.interceptors);
  });
});
