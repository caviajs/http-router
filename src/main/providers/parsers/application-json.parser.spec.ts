import { HttpException } from '../../exceptions/http-exception';
import { ApplicationJsonParser } from './application-json.parser';

describe('ApplicationJsonParser', () => {
  const data: object = { foo: 'bar' };
  const buffer: Buffer = Buffer.from(JSON.stringify(data));

  let applicationJsonParser: ApplicationJsonParser;

  beforeEach(() => {
    applicationJsonParser = new ApplicationJsonParser();
  });

  it('should return valid data for a payload without a charset', () => {
    expect(applicationJsonParser.parse(buffer, { 'content-type': 'application/json' })).toEqual(data);
  });

  it('should return valid data for a payload with a charset', () => {
    expect(applicationJsonParser.parse(buffer, { 'content-type': 'application/json; charset=UTF-8' })).toEqual(data);
  });

  it('should thrown an HttpException if charset is not supported', () => {
    const charset: string = 'popcorn';

    try {
      applicationJsonParser.parse(buffer, { 'content-type': `application/json; charset=${ charset }` });
    } catch (error) {
      expect((error as HttpException).status).toBe(415);
      expect((error as HttpException).reason).toBe(`Unsupported charset: ${ charset }`);
    }
  });
});
