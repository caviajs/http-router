import { INJECTABLE_METADATA, Injectable, InjectableMetadata } from './injectable';

describe('@Injectable', () => {
  it('should add the appropriate metadata while using decorator', () => {
    @Injectable()
    class Foo {
    }

    const metadata: InjectableMetadata = Reflect.getMetadata(INJECTABLE_METADATA, Foo);

    expect(metadata).toEqual(true);
  });
});
