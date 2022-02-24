import { getProviderName, Token } from '../../../src/public-api';

describe('getProviderName', () => {
  it('should return correct provider name for a class provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    class Lorem {
    }

    expect(getProviderName({ provide: Foo, useClass: Lorem })).toBe(Foo.name);
    expect(getProviderName({ provide: bar, useClass: Lorem })).toBe(bar.toString());
    expect(getProviderName({ provide: baz, useClass: Lorem })).toBe(baz.toString());
  });

  it('should return correct provider name for an existing provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderName({ provide: Foo, useExisting: 'lorem' })).toBe(Foo.name);
    expect(getProviderName({ provide: bar, useExisting: 'lorem' })).toBe(bar.toString());
    expect(getProviderName({ provide: baz, useExisting: 'lorem' })).toBe(baz.toString());
  });

  it('should return correct provider name for a factory provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderName({ provide: Foo, useFactory: () => 'lorem' })).toBe(Foo.name);
    expect(getProviderName({ provide: bar, useFactory: () => 'lorem' })).toBe(bar.toString());
    expect(getProviderName({ provide: baz, useFactory: () => 'lorem' })).toBe(baz.toString());
  });

  it('should return correct provider name for a type provider', () => {
    class Foo {
    }

    expect(getProviderName(Foo)).toBe(Foo.name);
  });

  it('should return correct provider name for a value provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderName({ provide: Foo, useValue: 'lorem' })).toBe(Foo.name);
    expect(getProviderName({ provide: bar, useValue: 'lorem' })).toBe(bar.toString());
    expect(getProviderName({ provide: baz, useValue: 'lorem' })).toBe(baz.toString());
  });
});
