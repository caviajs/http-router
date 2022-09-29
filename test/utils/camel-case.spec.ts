import { camelCase } from '../../src/utils/camel-case';

it('should convert the text to a camel case', () => {
  expect(camelCase('hello world 123')).toBe('helloWorld123');
});
