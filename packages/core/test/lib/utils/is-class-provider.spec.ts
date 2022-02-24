import { isClassProvider } from '../../../src/public-api';

describe('isClassProvider', () => {
  it('should return false for a null', () => {
    expect(isClassProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isClassProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isClassProvider({})).toBe(false);
  });

  it('should return true for object with useClass property', () => {
    expect(isClassProvider({ useClass: 'foo' })).toBe(true);
  });
});
