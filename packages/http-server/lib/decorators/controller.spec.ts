import { INJECTABLE_METADATA } from '@caviajs/core';
import { Controller, CONTROLLER_PATH_METADATA } from './controller';

describe('@Controller', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using the @Controller decorator without prefix', () => {
    @Controller()
    class Foo {
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(INJECTABLE_METADATA, true, Foo);
    expect(defineMetadataSpy).toHaveBeenCalledWith(CONTROLLER_PATH_METADATA, '/', Foo);
  });

  it('should add the appropriate metadata while using the @Controller decorator with prefix', () => {
    @Controller('foo')
    class Foo {
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(INJECTABLE_METADATA, true, Foo);
    expect(defineMetadataSpy).toHaveBeenCalledWith(CONTROLLER_PATH_METADATA, 'foo', Foo);
  });
});
