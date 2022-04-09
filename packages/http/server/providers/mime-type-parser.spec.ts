import { File, MimeTypeParser, Parser } from './mime-type-parser';
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
      const data: object = { foo: 'bar', foz: 'baz' };
      const buffer: Buffer = Buffer.from('foo=bar&foz=baz');

      it('should be built-in', () => {
        expect(mimeTypeParser.has('application/x-www-form-urlencoded')).toBe(true);
      });

      it('should return valid data for a payload without a charset', () => {
        const parser: Parser = mimeTypeParser.get('application/x-www-form-urlencoded');

        expect(parser(buffer, { 'content-type': 'application/x-www-form-urlencoded' })).toEqual(data);
      });

      it('should return valid data for a payload with a charset', () => {
        const parser: Parser = mimeTypeParser.get('application/x-www-form-urlencoded');

        expect(parser(buffer, { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' })).toEqual(data);
      });

      it('should thrown an HttpException if charset is not supported', () => {
        const charset: string = 'popcorn';
        const parser: Parser = mimeTypeParser.get('application/x-www-form-urlencoded');

        try {
          parser(buffer, { 'content-type': `application/json; charset=${ charset }` });
        } catch (error) {
          expect((error as HttpException).status).toBe(415);
          expect((error as HttpException).reason).toBe(`Unsupported charset: ${ charset }`);
        }
      });
    });

    describe('multipart/form-data', () => {
      let body = 'trash1\r\n';
      body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
      body += 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"\r\n';
      body += 'Content-Type: text/plain\r\n';
      body += '\r\n';
      body += '@11X';
      body += '111Y\r\n';
      body += '111Z\rCCCC\nCCCC\r\nCCCCC@\r\n\r\n';
      body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
      body += 'Content-Disposition: form-data; name="uploads[]"; filename="B.txt"\r\n';
      body += 'Content-Type: text/plain\r\n';
      body += '\r\n';
      body += '@22X';
      body += '222Y\r\n';
      body += '222Z\r222W\n2220\r\n666@\r\n';
      body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
      body += 'Content-Disposition: form-data; name="input1"\r\n';
      body += '\r\n';
      body += 'value1\r\n';
      body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp--\r\n';

      const data: File[] = [
        {
          data: Buffer.from('@11X111Y\r\n111Z\rCCCC\nCCCC\r\nCCCCC@\r\n'),
          fileName: 'A.txt',
          mimeType: 'text/plain',
          // name: 'uploads',
        },
        {
          data: Buffer.from('@22X222Y\r\n222Z\r222W\n2220\r\n666@'),
          fileName: 'B.txt',
          mimeType: 'text/plain',
          // name: 'uploads',
        },
        {
          data: Buffer.from('value1'),
          name: 'input1',
        },
      ];
      const buffer: Buffer = Buffer.from(body);

      it('should be built-in', () => {
        expect(mimeTypeParser.has('multipart/form-data')).toBe(true);
      });

      it('should return valid data for a payload', () => {
        const parser: Parser = mimeTypeParser.get('multipart/form-data');

        expect(parser(buffer, { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryvef1fLxmoUdYZWXp' })).toEqual(data);
      });

      it('should thrown an HttpException if the boundary is not set', () => {
        const parser: Parser = mimeTypeParser.get('multipart/form-data');

        try {
          parser(buffer, { 'content-type': `multipart/form-data` });
        } catch (error) {
          expect((error as HttpException).status).toBe(415);
          expect((error as HttpException).reason).toBe(`Unsupported Media Type: no boundary`);
        }
      });
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
