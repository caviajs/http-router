import { getContentDispositionParameter } from '../../../src/public-api';

describe('getContentDispositionParameter', () => {
  it('should return undefined for invalid content-disposition header', () => {
    expect(getContentDispositionParameter(undefined, 'filename')).toBeUndefined();
    expect(getContentDispositionParameter('', 'filename')).toBeUndefined();
  });

  it('should return correct parameter from content-disposition header', () => {
    expect(getContentDispositionParameter('form-data', 'filename')).toBeUndefined();
    expect(getContentDispositionParameter('form-data; name="uploads[]"; filename="A.txt"', 'name')).toBe('"uploads[]"');
    expect(getContentDispositionParameter('form-data; name="uploads[]"; filename="A.txt"', 'filename')).toBe('"A.txt"');
  });
});
