import { Head } from './head';
import { HttpReflector } from '../http-reflector';

describe('@Head', () => {
  let addRouteMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addRouteMetadataSpy = jest.spyOn(HttpReflector, 'addRouteMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addRouteMetadataSpy when the @Head decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addRouteMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Head decorator without path', () => {
    class Foo {
      @Head()
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'HEAD', path: '/' });
  });

  it('should execute the addRouteMetadata method with the appropriate arguments while using the @Head decorator with path', () => {
    class Foo {
      @Head('foo')
      hello() {
      }
    }

    expect(addRouteMetadataSpy).toHaveBeenNthCalledWith(1, Foo, 'hello', { method: 'HEAD', path: 'foo' });
  });
});
