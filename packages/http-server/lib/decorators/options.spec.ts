import { Options } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Options', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadataSpy when the @Options decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Options decorator without path', () => {
    class Foo {
      @Options()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'OPTIONS', path: '/' });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Options decorator with path', () => {
    class Foo {
      @Options('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'OPTIONS', path: 'foo' });
  });
});
