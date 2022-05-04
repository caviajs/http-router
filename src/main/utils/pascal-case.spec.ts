import { pascalCase } from './pascal-case';

describe('pascalCase', () => {
  it('should correctly convert to pascal case format', () => {
    expect(pascalCase('LoremIpsum isSimply_dummy-text123')).toBe('LoremIpsumIsSimplyDummyText123');
  });
});
