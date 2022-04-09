import { MimeTypeParser, Parser } from './mime-type-parser';
import { HttpException } from '../http-exception';

describe('MimeTypeParser', () => {
  let mimeTypeParser: MimeTypeParser;

  beforeEach(() => {
    mimeTypeParser = new MimeTypeParser();
  });

  describe('built-in mime type parsers', () => {
    describe('application/json', () => {
      const data: object = { foo: 'bar' };
      const buffer: Buffer = Buffer.from(JSON.stringify(data));

      it('should be built-in', () => {
        expect(mimeTypeParser.has('application/json')).toBe(true);
      });

      it('should return valid data for a payload without a charset', () => {
        const parser: Parser = mimeTypeParser.get('application/json');

        expect(parser(buffer, { 'content-type': 'application/json' })).toEqual(data);
      });

      it('should return valid data for a payload with a charset', () => {
        const parser: Parser = mimeTypeParser.get('application/json');

        expect(parser(buffer, { 'content-type': 'application/json; charset=UTF-8' })).toEqual(data);
      });

      it('should thrown an HttpException if charset is not supported', () => {
        const charset: string = 'popcorn';
        const parser: Parser = mimeTypeParser.get('application/json');

        try {
          parser(buffer, { 'content-type': `application/json; charset=${ charset }` });
        } catch (error) {
          expect((error as HttpException).status).toBe(415);
          expect((error as HttpException).reason).toBe(`Unsupported charset: ${ charset }`);
        }
      });
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
      const data: string = 'Hello World';
      const buffer: Buffer = Buffer.from(data);

      it('should be built-in', () => {
        expect(mimeTypeParser.has('text/plain')).toBe(true);
      });

      it('should return valid data for a payload without a charset', () => {
        const parser: Parser = mimeTypeParser.get('text/plain');

        expect(parser(buffer, { 'content-type': 'text/plain' })).toEqual(data);
      });

      it('should return valid data for a payload with a charset', () => {
        const parser: Parser = mimeTypeParser.get('text/plain');

        expect(parser(buffer, { 'content-type': 'text/plain; charset=UTF-8' })).toEqual(data);
      });

      it('should thrown an HttpException if charset is not supported', () => {
        const charset: string = 'popcorn';
        const parser: Parser = mimeTypeParser.get('text/plain');

        try {
          parser(buffer, { 'content-type': `text/plain; charset=${ charset }` });
        } catch (error) {
          expect((error as HttpException).status).toBe(415);
          expect((error as HttpException).reason).toBe(`Unsupported charset: ${ charset }`);
        }
      });
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
