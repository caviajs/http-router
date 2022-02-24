import { getOptionalMetadata, hasOptionalMetadata, Optional, OptionalMetadata } from '../../../src/public-api';

describe('@Optional', () => {
  it('should return false if the class does not use the @Optional decorator', () => {
    class Foo {
    }

    expect(getOptionalMetadata(Foo)).toEqual(undefined);
    expect(hasOptionalMetadata(Foo)).toEqual(false);
  });

  it('should return the appropriate metadata if the class uses the @Optional decorator', () => {
    class Foo {
      constructor(
        bar: any,
        @Optional() baz: any,
        qux: any,
        @Optional() quz: any,
      ) {
      }
    }

    const metadata: OptionalMetadata = getOptionalMetadata(Foo);

    expect(metadata.size).toBe(2);
    expect(metadata.get(1)).toBe(true);
    expect(metadata.get(3)).toBe(true);

    expect(hasOptionalMetadata(Foo)).toEqual(true);
  });
});
