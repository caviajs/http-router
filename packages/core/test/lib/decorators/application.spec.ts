import { getApplicationMetadata, hasApplicationMetadata, Application, ApplicationOptions } from '../../../src/public-api';

describe('@Application', () => {
  it('should return false if the class does not use the @Application decorator', () => {
    class Foo {
    }

    expect(getApplicationMetadata(Foo)).toEqual(undefined);
    expect(hasApplicationMetadata(Foo)).toEqual(false);
  });

  it('should return the appropriate metadata if the class uses the @Application decorator', () => {
    const options: ApplicationOptions = {
      packages: [
        { providers: [{ provide: 'bar', useFactory: () => 'bar' }] },
        { providers: [{ provide: 'baz', useValue: 'baz' }] },
      ],
      providers: [
        { provide: 'foo', useValue: 'foo' }
      ],
    };

    @Application(options)
    class Foo {
    }

    expect(getApplicationMetadata(Foo)).toEqual(options);
    expect(hasApplicationMetadata(Foo)).toEqual(true);
  });
});
