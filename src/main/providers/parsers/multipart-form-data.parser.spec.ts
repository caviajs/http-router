import { HttpException } from '../../exceptions/http-exception';
import { File } from '../../types/file';
import { MultipartFormDataParser } from './multipart-form-data.parser';

describe('MultipartFormDataParser', () => {
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

  let multipartFormDataParser: MultipartFormDataParser;

  beforeEach(() => {
    multipartFormDataParser = new MultipartFormDataParser();
  });

  it('should return valid data for a payload', () => {
    expect(multipartFormDataParser.parse(buffer, { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryvef1fLxmoUdYZWXp' })).toEqual(data);
  });

  it('should thrown an HttpException if the boundary is not set', () => {
    try {
      multipartFormDataParser.parse(buffer, { 'content-type': `multipart/form-data` });
    } catch (error) {
      expect((error as HttpException).status).toBe(415);
      expect((error as HttpException).reason).toBe(`Unsupported Media Type: no boundary`);
    }
  });
});
