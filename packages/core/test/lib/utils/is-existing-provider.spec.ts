import { isExistingProvider } from '../../../src/public-api';

describe('isExistingProvider', () => {
  it('should return false for a null', () => {
    expect(isExistingProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isExistingProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isExistingProvider({})).toBe(false);
  });

  it('should return true for object with useExisting property', () => {
    expect(isExistingProvider({ useExisting: 'foo' })).toBe(true);
  });
});
