import { snakeCase } from './snake-case';

describe('snakeCase', () => {
  it('should correctly convert to snake case format', () => {
    expect(snakeCase('LoremIpsum isSimply_dummy-text123')).toBe('lorem_ipsum_is_simply_dummy_text123');
  });
});
