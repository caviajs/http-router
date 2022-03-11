import { ForwardRef, forwardRef, isForwardRef } from './forward-ref';

describe('forwardRef', () => {
  it('should return ForwardRef', () => {
    const fn = () => 'foo';

    expect(forwardRef(fn)).toEqual({ forwardRef: fn });
  });
});

describe('isForwardRef', () => {
  it('should return false for a null', () => {
    expect(isForwardRef(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isForwardRef(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isForwardRef({})).toBe(false);
  });

  it('should return true for a ForwardRef', async () => {
    const result: ForwardRef = forwardRef(() => 'foo');

    expect(isForwardRef(result)).toBe(true);
  });
});
