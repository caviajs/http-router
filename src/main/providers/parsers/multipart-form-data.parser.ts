import http from 'http';
import * as multipart from 'parse-multipart-data';
import { Injectable } from '../../decorators/injectable';
import { HttpException } from '../../exceptions/http-exception';
import { File } from '../../types/file';
import { Parser, ParserMetadata } from '../../types/parser';
import { getContentTypeParameter } from '../../utils/get-content-type-parameter';

@Injectable()
export class MultipartFormDataParser extends Parser {
  public readonly metadata: ParserMetadata = {
    mimeType: 'multipart/form-data',
  };

  public parse(buffer: Buffer, headers: http.IncomingHttpHeaders): unknown {
    const boundary: string | undefined = getContentTypeParameter(headers['content-type'], 'boundary');

    if (!boundary) {
      throw new HttpException(415, 'Unsupported Media Type: no boundary');
    }

    return multipart
      .parse(buffer, boundary)
      .map(it => {
        return {
          data: it.data,
          fileName: it.filename,
          mimeType: it.type,
          name: it.name,
        } as File;
      });
  }
}
