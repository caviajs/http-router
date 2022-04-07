import { Injectable } from '@caviajs/core';
import http from 'http';
import iconv from 'iconv-lite';
import qs from 'qs';
import multipart from 'parse-multipart-data';
import { getContentTypeParameter } from '../utils/get-content-type-parameter';
import { HttpException } from '../http-exception';

const BUILT_IN_MIME_TYPE_PARSERS: { [name: string]: Parser } = {
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
      .filter(it => ({
        fileName: it.filename,
        name: it.name,
        type: it.type,
        buffer: it.data,
      }));
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
export class MimeTypeParser {
  protected readonly parsers: Map<string, Parser> = new Map(Object.entries(BUILT_IN_MIME_TYPE_PARSERS));

  public delete(mimeType: string): void {
    this.parsers.delete(mimeType);
  }

  public get(mimeType: string): Parser | undefined {
    return this.parsers.get(mimeType);
  }

  public has(mimeType: string): boolean {
    return this.parsers.has(mimeType);
  }

  public set(mimeType: string, mimeTypeParser: Parser): void {
    this.parsers.set(mimeType, mimeTypeParser);
  }
}

export interface Parser {
  (buffer: Buffer, headers: http.IncomingHttpHeaders): any;
}
