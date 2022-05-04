import http from 'http';
import iconv from 'iconv-lite';
import { Injectable } from '../../decorators/injectable';
import { HttpException } from '../../exceptions/http-exception';
import { Parser, ParserMetadata } from '../../types/parser';
import { getContentTypeParameter } from '../../utils/get-content-type-parameter';

@Injectable()
export class ApplicationJsonParser extends Parser {
  public readonly metadata: ParserMetadata = {
    mimeType: 'application/json',
  };

  public parse(buffer: Buffer, headers: http.IncomingHttpHeaders): any {
    const charset: string | undefined = getContentTypeParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return JSON.parse(charset ? iconv.decode(buffer, charset) : buffer.toString());
  }
}
