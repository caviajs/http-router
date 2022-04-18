import { Headers } from './headers';

describe('Headers', () => {
  const headers: Headers = new Headers();

  describe('contentType', () => {
    describe('getMime', () => {
      it('should return undefined for invalid content-type header', () => {
        expect(headers.contentType.getMime(undefined)).toBeUndefined();
        expect(headers.contentType.getMime('')).toBeUndefined();
      });

      it('should return correct mime type', () => {
        expect(headers.contentType.getMime('text/html')).toBe('text/html');
        expect(headers.contentType.getMime('text/html; charset=utf-8')).toBe('text/html');
      });
    });

    describe('getParameter', () => {
      it('should return undefined for invalid content-type header', () => {
        expect(headers.contentType.getParameter(undefined, 'charset')).toBeUndefined();
        expect(headers.contentType.getParameter('', 'charset')).toBeUndefined();
      });

      it('should return correct parameter from content-type header', () => {
        expect(headers.contentType.getParameter('text/html', 'charset')).toBeUndefined();
        expect(headers.contentType.getParameter('text/html; charset=utf-8', 'charset')).toBe('utf-8');
        expect(headers.contentType.getParameter('text/html; charset=utf-8; boundary=something', 'charset')).toBe('utf-8');
        expect(headers.contentType.getParameter('text/html; charset=utf-8; boundary=something', 'boundary')).toBe('something');
      });
    });
  });
});
