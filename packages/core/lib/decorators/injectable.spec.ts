import { getInjectableMetadata, hasInjectableMetadata, Injectable } from '../../index';

describe('@Injectable', () => {
  it('should return false if the class does not use the @Injectable decorator', () => {
    class Foo {
    }

    expect(getInjectableMetadata(Foo)).toEqual(undefined);
    expect(hasInjectableMetadata(Foo)).toEqual(false);
  });

  it('should return the appropriate metadata if the class uses the @Injectable decorator', () => {
    @Injectable()
    class Foo {
    }

    expect(getInjectableMetadata(Foo)).toEqual(true);
    expect(hasInjectableMetadata(Foo)).toEqual(true);
  });
});
