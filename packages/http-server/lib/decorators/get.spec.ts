import { Get } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

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

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Get decorator without path', () => {
    class Foo {
      @Get()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'GET', path: '/' });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Get decorator with path', () => {
    class Foo {
      @Get('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'GET', path: 'foo' });
  });
});
