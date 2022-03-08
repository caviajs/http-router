import { Patch } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Patch', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadataSpy when the @Patch decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Patch decorator without path', () => {
    class Foo {
      @Patch()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'PATCH', path: '/' });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Patch decorator with path', () => {
    class Foo {
      @Patch('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'PATCH', path: 'foo' });
  });
});
