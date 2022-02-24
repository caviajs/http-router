import { getProviderToken, Token } from '../../../src/public-api';

describe('getProviderToken', () => {
  it('should return correct provider token for a class provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    class Lorem {
    }

    expect(getProviderToken({ provide: Foo, useClass: Lorem })).toBe(Foo);
    expect(getProviderToken({ provide: bar, useClass: Lorem })).toBe(bar);
    expect(getProviderToken({ provide: baz, useClass: Lorem })).toBe(baz);
  });

  it('should return correct provider token for an existing provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderToken({ provide: Foo, useExisting: 'lorem' })).toBe(Foo);
    expect(getProviderToken({ provide: bar, useExisting: 'lorem' })).toBe(bar);
    expect(getProviderToken({ provide: baz, useExisting: 'lorem' })).toBe(baz);
  });

  it('should return correct provider token for a factory provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderToken({ provide: Foo, useFactory: () => 'lorem' })).toBe(Foo);
    expect(getProviderToken({ provide: bar, useFactory: () => 'lorem' })).toBe(bar);
    expect(getProviderToken({ provide: baz, useFactory: () => 'lorem' })).toBe(baz);
  });

  it('should return correct provider token for a type provider', () => {
    class Foo {
    }

    expect(getProviderToken(Foo)).toBe(Foo);
  });

  it('should return correct provider token for a value provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderToken({ provide: Foo, useValue: 'lorem' })).toBe(Foo);
    expect(getProviderToken({ provide: bar, useValue: 'lorem' })).toBe(bar);
    expect(getProviderToken({ provide: baz, useValue: 'lorem' })).toBe(baz);
  });
});
