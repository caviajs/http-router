import { MimeTypeParser, Parser } from './mime-type-parser';

describe('MimeTypeParser', () => {
  let mimeTypeParser: MimeTypeParser;

  beforeEach(() => {
    mimeTypeParser = new MimeTypeParser();
  });

  describe('built-in mime type parsers', () => {
    describe('application/json', () => {
      it('should be built-in', () => {
        expect(mimeTypeParser.has('application/json')).toBe(true);
      });

      // return correct data without charset
      // return correct data with charset
      // throw error if charset is not supported
    });

    describe('application/x-www-form-urlencoded', () => {
      it('should be built-in', () => {
        expect(mimeTypeParser.has('application/x-www-form-urlencoded')).toBe(true);
      });

      // return correct data without charset
      // return correct data with charset
      // throw error if charset is not supported
    });

    describe('multipart/form-data', () => {
      it('should be built-in', () => {
        expect(mimeTypeParser.has('multipart/form-data')).toBe(true);
      });

      // return correct data without charset
      // return correct data with charset
      // throw error if charset is not supported
    });

    describe('text/plain', () => {
      it('should be built-in', () => {
        expect(mimeTypeParser.has('text/plain')).toBe(true);
      });

      // return correct data without charset
      // return correct data with charset
      // throw error if charset is not supported
    });
  });

  describe('delete', () => {
    it('should delete the parser if it exists', () => {
      expect(mimeTypeParser.has('application/json')).toBe(true);

      mimeTypeParser.delete('application/json');

      expect(mimeTypeParser.has('application/json')).toBe(false);
    });
  });

  describe('get', () => {
    it('should return parser if exists', () => {
      expect(mimeTypeParser.get('application/json')).toEqual(expect.any(Function));
    });

    it('should return undefined if not exists', () => {
      expect(mimeTypeParser.get('application/xml')).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true if parser exists', () => {
      expect(mimeTypeParser.has('application/json')).toBe(true);
    });

    it('should return false if parser not exists', () => {
      expect(mimeTypeParser.has('application/xml')).toBe(false);
    });
  });

  describe('set', () => {
    it('should set or override the parser', () => {
      const parser: Parser = jest.fn();

      mimeTypeParser.set('application/json', parser);

      expect(mimeTypeParser.get('application/json')).toEqual(parser);
    });
  });
});
