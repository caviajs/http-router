import { camelCase } from './camel-case';

describe('camelCase', () => {
  it('should correctly convert to camel case format', () => {
    expect(camelCase('LoremIpsum isSimply_dummy-text123')).toBe('loremIpsumIsSimplyDummyText123');
  });
});
