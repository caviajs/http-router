import { isValueProvider } from '../../index';

describe('isValueProvider', () => {
  it('should return false for a null', () => {
    expect(isValueProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isValueProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isValueProvider({})).toBe(false);
  });

  it('should return true for object with useValue property', () => {
    expect(isValueProvider({ useValue: 'bar' })).toBe(true);
  });
});
