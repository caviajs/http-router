import { forwardRef, getInjectMetadata, hasInjectMetadata, Inject, InjectMetadata } from '../../../src/public-api';

describe('@Inject', () => {
  it('should return false if the class does not use the @Inject decorator', () => {
    class Foo {
    }

    expect(getInjectMetadata(Foo)).toEqual(undefined);
    expect(hasInjectMetadata(Foo)).toEqual(false);
  });

  it('should return the appropriate metadata if the class uses the @Inject decorator', () => {
    const baz = 'baz';
    const quz = forwardRef(() => 'quz');

    class Foo {
      constructor(
        bar: any,
        @Inject(baz) baz: any,
        qux: any,
        @Inject(quz) quz: any,
      ) {
      }
    }

    const metadata: InjectMetadata = getInjectMetadata(Foo);

    expect(metadata.size).toBe(2);
    expect(metadata.get(1)).toBe(baz);
    expect(metadata.get(3)).toBe(quz);

    expect(hasInjectMetadata(Foo)).toEqual(true);
  });
});
