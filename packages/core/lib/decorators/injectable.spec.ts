import { INJECTABLE_METADATA, Injectable, InjectableMetadata } from './injectable';

describe('@Injectable', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    @Injectable()
    class Foo {
    }

    const injectableMetadata: InjectableMetadata = true;

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(INJECTABLE_METADATA, injectableMetadata, Foo);
  });
});
