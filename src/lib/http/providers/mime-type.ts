import http from 'http';
import iconv from 'iconv-lite';
import qs from 'qs';
import * as multipart from 'parse-multipart-data';
import { getContentTypeMime } from '../utils/get-content-type-mime';
import { getContentTypeParameter } from '../utils/get-content-type-parameter';
import { HttpException } from '../http-exception';
import { Injectable } from '../../ioc/decorators/injectable';

const BUILT_IN_MIME_TYPE_PARSERS: { [name: string]: MimeTypeParser } = {
  'application/json': (buffer, headers) => {
    const charset: string | undefined = getContentTypeParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return JSON.parse(charset ? iconv.decode(buffer, charset) : buffer.toString());
  },
  'application/x-www-form-urlencoded': (buffer, headers) => {
    const charset: string | undefined = getContentTypeParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return qs.parse(charset ? iconv.decode(buffer, charset) : buffer.toString(), { allowDots: true });
  },
  'multipart/form-data': (buffer, headers) => {
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
  },
  'text/plain': (buffer, headers) => {
    const charset: string | undefined = getContentTypeParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return charset ? iconv.decode(buffer, charset) : buffer.toString();
  },
};

@Injectable()
export class MimeType {
  protected readonly mimeTypeParsers: Map<string, MimeTypeParser> = new Map(
    Object.entries(BUILT_IN_MIME_TYPE_PARSERS),
  );

  public addMimeTypeParser(mimeType: string, mimeTypeParser: MimeTypeParser): void {
    this.mimeTypeParsers.set(mimeType, mimeTypeParser);
  }

  public deleteMimeTypeParser(mimeType: string): void {
    this.mimeTypeParsers.delete(mimeType);
  }

  public parseBuffer(buffer: Buffer, headers: http.IncomingHttpHeaders): any {
    const mimeType = getContentTypeMime(headers['content-type']);

    if (!this.mimeTypeParsers.has(mimeType)) {
      throw new HttpException(415, `Unsupported Media Type: ${ mimeType }`);
    }

    return this.mimeTypeParsers.get(mimeType)(buffer, headers);
  }
}

export interface File {
  data: Buffer;
  fileName?: string;
  mimeType?: string;
  name?: string;
}

export interface MimeTypeParser {
  (buffer: Buffer, headers: http.IncomingHttpHeaders): any;
}
