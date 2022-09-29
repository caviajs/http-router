import { kebabCase } from '../../src/utils/kebab-case';

it('should convert the text to a kebab case', () => {
  expect(kebabCase('hello world 123')).toBe('hello-world-123');
});
