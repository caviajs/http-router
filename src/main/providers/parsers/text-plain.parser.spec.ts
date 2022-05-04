import { TextPlainParser } from './text-plain.parser';
import { HttpException } from '../../exceptions/http-exception';

describe('TextPlainParser', () => {
  const data: string = 'Hello World';
  const buffer: Buffer = Buffer.from(data);

  let textPlainParser: TextPlainParser;

  beforeEach(() => {
    textPlainParser = new TextPlainParser();
  });

  it('should return valid data for a payload without a charset', () => {
    expect(textPlainParser.parse(buffer, { 'content-type': 'text/plain' })).toEqual(data);
  });

  it('should return valid data for a payload with a charset', () => {
    expect(textPlainParser.parse(buffer, { 'content-type': 'text/plain; charset=UTF-8' })).toEqual(data);
  });

  it('should thrown an HttpException if charset is not supported', () => {
    const charset: string = 'popcorn';

    try {
      textPlainParser.parse(buffer, { 'content-type': `text/plain; charset=${ charset }` });
    } catch (error) {
      expect((error as HttpException).status).toBe(415);
      expect((error as HttpException).reason).toBe(`Unsupported charset: ${ charset }`);
    }
  });
});
