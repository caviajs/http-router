import { Body } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Body', () => {
  let addRouteParamMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteParamMetadataSpy = jest.spyOn(HttpReflector, 'addRouteParamMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteParamMetadataSpy when the @Body decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteParamMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteParamMetadata method with the appropriate arguments while using the @Body decorator without any arguments', () => {
    class Foo {
      hello(@Body() body) {
      }
    }

    expect(addRouteParamMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      factory: expect.any(Function),
      index: 0,
      pipes: [],
    });
  });

  it('should execute the addRouteParamMetadata method with the appropriate arguments while using the @Body decorator with prefix only', () => {
    class Foo {
      hello(@Body('foo') body) {
      }
    }

    expect(addRouteParamMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', {
      factory: expect.any(Function),
      index: 0,
      pipes: [],
    });
  });
});
