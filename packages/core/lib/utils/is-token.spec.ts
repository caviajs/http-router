import { isToken } from './is-token';

describe('isToken', () => {
  it('should return true for the string', () => {
    expect(isToken('foo')).toBe(true);
  });

  it('should return false for the number', () => {
    expect(isToken(1245)).toBe(false);
  });

  it('should return false for the true', () => {
    expect(isToken(true)).toBe(false);
  });

  it('should return false for the false', () => {
    expect(isToken(false)).toBe(false);
  });

  it('should return false for the undefined', () => {
    expect(isToken(undefined)).toBe(false);
  });

  it('should return true for the symbol', () => {
    expect(isToken(Symbol('foo'))).toBe(true);
  });

  it('should return false for the null', () => {
    expect(isToken(null)).toBe(false);
  });

  it('should return false for the array', () => {
    expect(isToken([])).toBe(false);
  });

  it('should return false for the object', () => {
    expect(isToken({})).toBe(false);
  });

  it('should return false for the function reference', () => {
    function foo() {
    }

    expect(isToken(foo)).toBe(false);
  });

  it('should return true for the class reference', () => {
    class Foo {
    }

    expect(isToken(Foo)).toBe(true);
  });
});
