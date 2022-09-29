import { convertToNumber } from '../../src/utils/convert-to-number';

it('should return a number for a numeric string', () => {
  expect(convertToNumber('1245')).toBe(1245);
});

it('should return the same data for an invalid numeric string', () => {
  expect(convertToNumber('')).toBe('');
  expect(convertToNumber('foo')).toBe('foo');
  expect(convertToNumber('foo1')).toBe('foo1');
});
