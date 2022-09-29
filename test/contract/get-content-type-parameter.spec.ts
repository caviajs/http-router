import { getContentTypeParameter } from '../../src/contract/get-content-type-parameter';

it('should return undefined for invalid content-type header', () => {
  expect(getContentTypeParameter(undefined, 'charset')).toBeUndefined();
  expect(getContentTypeParameter('', 'charset')).toBeUndefined();
});

it('should return correct parameter from content-type header', () => {
  expect(getContentTypeParameter('text/html', 'charset')).toBeUndefined();
  expect(getContentTypeParameter('text/html; charset=utf-8', 'charset')).toBe('utf-8');
  expect(getContentTypeParameter('text/html; charset=utf-8; boundary=something', 'charset')).toBe('utf-8');
  expect(getContentTypeParameter('text/html; charset=utf-8; boundary=something', 'boundary')).toBe('something');
});
