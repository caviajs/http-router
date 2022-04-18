import { getTokenName } from './get-token-name';
import { Token } from '../types/token';

describe('getTokenName', () => {
  it('should return correct token name for a string token', () => {
    const foo: Token = 'foo';

    expect(getTokenName(foo)).toBe(foo.toString());
  });

  it('should return correct token name for a symbol token', () => {
    const foo: Token = Symbol('foo');

    expect(getTokenName(foo)).toBe(foo.toString());
  });

  it('should return correct token name for a Type token', () => {
    class Foo {
    }

    expect(getTokenName(Foo)).toBe(Foo.name);
  });
});
