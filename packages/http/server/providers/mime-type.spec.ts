import { File, MimeType, MimeTypeParser } from './mime-type';
import { HttpException } from '../http-exception';

class MimeTypeTest extends MimeType {
  public get getMimeTypeParsers() {
    return this.mimeTypeParsers;
  }
}

describe('MimeType', () => {
  let mimeType: MimeTypeTest;

  beforeEach(() => {
    mimeType = new MimeTypeTest();
  });

  describe('addMimeTypeParser', () => {
    it('should set or override the parser', () => {
      const parser: MimeTypeParser = jest.fn();

      mimeType.addMimeTypeParser('application/json', parser);

      expect(mimeType.getMimeTypeParsers.get('application/json')).toEqual(parser);
    });
  });

  describe('deleteMimeTypeParser', () => {
    it('should delete the parser if it exists', () => {
      expect(mimeType.getMimeTypeParsers.has('application/json')).toBe(true);

      mimeType.deleteMimeTypeParser('application/json');

      expect(mimeType.getMimeTypeParsers.has(('application/json'))).toBe(false);
    });
  });

  describe('built-in mime type parsers', () => {
    describe('application/json', () => {
      const data: object = { foo: 'bar' };
      const buffer: Buffer = Buffer.from(JSON.stringify(data));

      it('should return valid data for a payload without a charset', () => {
        expect(mimeType.parseBuffer(buffer, { 'content-type': 'application/json' })).toEqual(data);
      });

      it('should return valid data for a payload with a charset', () => {
        expect(mimeType.parseBuffer(buffer, { 'content-type': 'application/json; charset=UTF-8' })).toEqual(data);
      });

      it('should thrown an HttpException if charset is not supported', () => {
        const charset: string = 'popcorn';

        try {
          mimeType.parseBuffer(buffer, { 'content-type': `application/json; charset=${ charset }` });
        } catch (error) {
          expect((error as HttpException).status).toBe(415);
          expect((error as HttpException).reason).toBe(`Unsupported charset: ${ charset }`);
        }
      });
    });

    describe('application/x-www-form-urlencoded', () => {
      const data: object = { foo: 'bar', foz: 'baz' };
      const buffer: Buffer = Buffer.from('foo=bar&foz=baz');

      it('should return valid data for a payload without a charset', () => {
        expect(mimeType.parseBuffer(buffer, { 'content-type': 'application/x-www-form-urlencoded' })).toEqual(data);
      });

      it('should return valid data for a payload with a charset', () => {
        expect(mimeType.parseBuffer(buffer, { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' })).toEqual(data);
      });

      it('should thrown an HttpException if charset is not supported', () => {
        const charset: string = 'popcorn';

        try {
          mimeType.parseBuffer(buffer, { 'content-type': `application/json; charset=${ charset }` });
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

      it('should return valid data for a payload', () => {
        expect(mimeType.parseBuffer(buffer, { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryvef1fLxmoUdYZWXp' })).toEqual(data);
      });

      it('should thrown an HttpException if the boundary is not set', () => {
        try {
          mimeType.parseBuffer(buffer, { 'content-type': `multipart/form-data` });
        } catch (error) {
          expect((error as HttpException).status).toBe(415);
          expect((error as HttpException).reason).toBe(`Unsupported Media Type: no boundary`);
        }
      });
    });

    describe('text/plain', () => {
      const data: string = 'Hello World';
      const buffer: Buffer = Buffer.from(data);

      it('should return valid data for a payload without a charset', () => {
        expect(mimeType.parseBuffer(buffer, { 'content-type': 'text/plain' })).toEqual(data);
      });

      it('should return valid data for a payload with a charset', () => {
        expect(mimeType.parseBuffer(buffer, { 'content-type': 'text/plain; charset=UTF-8' })).toEqual(data);
      });

      it('should thrown an HttpException if charset is not supported', () => {
        const charset: string = 'popcorn';

        try {
          mimeType.parseBuffer(buffer, { 'content-type': `text/plain; charset=${ charset }` });
        } catch (error) {
          expect((error as HttpException).status).toBe(415);
          expect((error as HttpException).reason).toBe(`Unsupported charset: ${ charset }`);
        }
      });
    });
  });
});
