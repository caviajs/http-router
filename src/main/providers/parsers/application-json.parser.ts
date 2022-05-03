import http from 'http';
import iconv from 'iconv-lite';
import { Injectable } from '../../decorators/injectable';
import { HttpException } from '../../exceptions/http-exception';
import { Parser, ParserMetadata } from '../../types/parser';
import { Headers } from '../headers';

@Injectable()
export class ApplicationJsonParser extends Parser {
  public readonly metadata: ParserMetadata = {
    mimeType: 'application/json',
  };

  constructor(protected readonly headers: Headers) {
    super();
  }

  public parse(buffer: Buffer, headers: http.IncomingHttpHeaders): any {
    const charset: string | undefined = this.headers.contentType.getParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return JSON.parse(charset ? iconv.decode(buffer, charset) : buffer.toString());
  }
}
