import { kebabCase } from './kebab-case';

describe('kebabCase', () => {
  it('should correctly convert to kebab case format', () => {
    expect(kebabCase('LoremIpsum isSimply_dummy-text123')).toBe('lorem-ipsum-is-simply-dummy-text123');
  });
});
