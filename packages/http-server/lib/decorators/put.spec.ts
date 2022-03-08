import { Put } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Put', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadata when the @Put decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Put decorator without path', () => {
    class Foo {
      @Put()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'PUT', path: '/' });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Put decorator with path', () => {
    class Foo {
      @Put('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'PUT', path: 'foo' });
  });
});
