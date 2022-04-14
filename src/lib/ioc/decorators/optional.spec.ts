import { OPTIONAL_METADATA, Optional, OptionalMetadata } from './optional';

describe('@Optional', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    class Foo {
      constructor(
        bar: any,
        @Optional() baz: any,
        qux: any,
        @Optional() quz: any,
      ) {
      }
    }

    const optionalMetadata: OptionalMetadata = new Map().set(1, true).set(3, true);

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(OPTIONAL_METADATA, optionalMetadata, Foo);
  });
});
