import { isFactoryProvider } from '../../../src/public-api';

describe('isFactoryProvider', () => {
  it('should return false for a null', () => {
    expect(isFactoryProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isFactoryProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isFactoryProvider({})).toBe(false);
  });

  it('should return true for object with useFactory property', () => {
    expect(isFactoryProvider({ useFactory: () => 'foo' })).toBe(true);
  });
});
