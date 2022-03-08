import { Controller } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Controller', () => {
  let addControllerMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    addControllerMetadataSpy = jest.spyOn(HttpReflector, 'addControllerMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not execute addControllerMetadata when the @Controller decorator is not used', () => {
    class Foo {
      foo() {
      }
    }

    expect(addControllerMetadataSpy).not.toHaveBeenCalled();
  });

  it('should execute the addControllerMetadata method with the appropriate arguments while using the @Controller decorator without prefix', () => {
    @Controller()
    class Foo {
    }

    expect(addControllerMetadataSpy).toHaveBeenNthCalledWith(1, Foo, { prefix: '/' });
  });

  it('should execute the addControllerMetadata method with the appropriate arguments while using the @Controller decorator with prefix', () => {
    @Controller('foo')
    class Foo {
    }

    expect(addControllerMetadataSpy).toHaveBeenNthCalledWith(1, Foo, { prefix: 'foo' });
  });
});
