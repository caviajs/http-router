import { Controller, CONTROLLER_METADATA } from './controller';
import { INJECTABLE_METADATA } from '../../ioc/decorators/injectable';

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
    expect(defineMetadataSpy).toHaveBeenCalledWith(CONTROLLER_METADATA, { path: '/' }, Foo);
    expect(defineMetadataSpy).toHaveBeenCalledWith(INJECTABLE_METADATA, true, Foo);
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    @Controller('foo')
    class Foo {
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(CONTROLLER_METADATA, { path: 'foo' }, Foo);
    expect(defineMetadataSpy).toHaveBeenCalledWith(INJECTABLE_METADATA, true, Foo);
  });
});
