import { HttpException } from '../../exceptions/http-exception';
import { ApplicationXWwwFormUrlencodedParser } from './application-x-www-form-urlencoded.parser';

describe('ApplicationXWwwFormUrlencodedParser', () => {
  const data: object = { foo: 'bar', foz: 'baz' };
  const buffer: Buffer = Buffer.from('foo=bar&foz=baz');

  let applicationXWwwFormUrlencodedParser: ApplicationXWwwFormUrlencodedParser;

  beforeEach(() => {
    applicationXWwwFormUrlencodedParser = new ApplicationXWwwFormUrlencodedParser();
  });

  it('should return valid data for a payload without a charset', () => {
    expect(applicationXWwwFormUrlencodedParser.parse(buffer, { 'content-type': 'application/x-www-form-urlencoded' })).toEqual(data);
  });

  it('should return valid data for a payload with a charset', () => {
    expect(applicationXWwwFormUrlencodedParser.parse(buffer, { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' })).toEqual(data);
  });

  it('should thrown an HttpException if charset is not supported', () => {
    const charset: string = 'popcorn';

    try {
      applicationXWwwFormUrlencodedParser.parse(buffer, { 'content-type': `application/json; charset=${ charset }` });
    } catch (error) {
      expect((error as HttpException).status).toBe(415);
      expect((error as HttpException).reason).toBe(`Unsupported charset: ${ charset }`);
    }
  });
});
