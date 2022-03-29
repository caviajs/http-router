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

  it('should add the appropriate metadata while using decorator without path', () => {
    @Controller()
    class Foo {
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(INJECTABLE_METADATA, true, Foo);
    expect(defineMetadataSpy).toHaveBeenCalledWith(CONTROLLER_PATH_METADATA, '/', Foo);
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    @Controller('foo')
    class Foo {
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(INJECTABLE_METADATA, true, Foo);
    expect(defineMetadataSpy).toHaveBeenCalledWith(CONTROLLER_PATH_METADATA, 'foo', Foo);
  });
});
