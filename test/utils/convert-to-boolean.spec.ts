import { convertToBoolean } from '../../src/utils/convert-to-boolean';

it('should return a boolean for a boolean string', () => {
  expect(convertToBoolean('true')).toBe(true);
  expect(convertToBoolean('false')).toBe(false);
});

it('should return the same data for an invalid boolean string', () => {
  expect(convertToBoolean('1')).toBe('1');
  expect(convertToBoolean('0')).toBe('0');
  expect(convertToBoolean('foo')).toBe('foo');
});
