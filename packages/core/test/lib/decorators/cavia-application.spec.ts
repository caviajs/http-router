import { getCaviaApplicationMetadata, hasCaviaApplicationMetadata, CaviaApplication, CaviaApplicationOptions } from '../../../src/public-api';

describe('@CaviaApplication', () => {
  it('should return false if the class does not use the @CaviaApplication decorator', () => {
    class Foo {
    }

    expect(getCaviaApplicationMetadata(Foo)).toEqual(undefined);
    expect(hasCaviaApplicationMetadata(Foo)).toEqual(false);
  });

  it('should return the appropriate metadata if the class uses the @CaviaApplication decorator', () => {
    const options: CaviaApplicationOptions = {
      packages: [
        { providers: [{ provide: 'bar', useFactory: () => 'bar' }] },
        { providers: [{ provide: 'baz', useValue: 'baz' }] },
      ],
      providers: [
        { provide: 'foo', useValue: 'foo' }
      ],
    };

    @CaviaApplication(options)
    class Foo {
    }

    expect(getCaviaApplicationMetadata(Foo)).toEqual(options);
    expect(hasCaviaApplicationMetadata(Foo)).toEqual(true);
  });
});
