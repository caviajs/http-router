import http from 'http';
import iconv from 'iconv-lite';
import qs from 'qs';
import { Injectable } from '../../decorators/injectable';
import { HttpException } from '../../exceptions/http-exception';
import { Parser, ParserMetadata } from '../../types/parser';
import { getContentTypeParameter } from '../../utils/get-content-type-parameter';

@Injectable()
export class ApplicationXWwwFormUrlencodedParser extends Parser {
  public readonly metadata: ParserMetadata = {
    mimeType: 'application/x-www-form-urlencoded',
  };

  public parse(buffer: Buffer, headers: http.IncomingHttpHeaders): any {
    const charset: string | undefined = getContentTypeParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return qs.parse(charset ? iconv.decode(buffer, charset) : buffer.toString(), { allowDots: true });
  }
}
