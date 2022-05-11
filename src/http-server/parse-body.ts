import zlib from 'zlib';
import stream from 'stream';
import { HttpException } from './http-exception';
import { getContentTypeMime } from './get-content-type-mime';
import http from 'http';
import { getContentTypeParameter } from './get-content-type-parameter';
import iconv from 'iconv-lite';
import qs from 'qs';
import * as multipart from 'parse-multipart-data';

const BUILT_IN_PARSERS = {
  'application/json': (buffer: Buffer, headers: http.IncomingHttpHeaders) => {
    const charset: string | undefined = getContentTypeParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return JSON.parse(charset ? iconv.decode(buffer, charset) : buffer.toString());
  },
  'application/x-www-form-urlencoded': (buffer: Buffer, headers: http.IncomingHttpHeaders): any => {
    const charset: string | undefined = getContentTypeParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return qs.parse(charset ? iconv.decode(buffer, charset) : buffer.toString(), { allowDots: true });
  },
  'multipart/form-data': (buffer: Buffer, headers: http.IncomingHttpHeaders): unknown => {
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
  'text/plain': (buffer: Buffer, headers: http.IncomingHttpHeaders): unknown => {
    const charset: string | undefined = getContentTypeParameter(headers['content-type'], 'charset');

    if (charset && !iconv.encodingExists(charset)) {
      throw new HttpException(415, `Unsupported charset: ${ charset }`);
    }

    return charset ? iconv.decode(buffer, charset) : buffer.toString();
  },
};

const DEFAULT_PARSE_BODY_OPTIONS: ParseBodyOptions = {
  limit: 1048576, // 10 Mbits
};

const parsers: Map<string, Parser> = new Map([...Object.entries(BUILT_IN_PARSERS)]);

export async function parseBody<T = any>(request: http.IncomingMessage, options?: ParseBodyOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    options = { ...DEFAULT_PARSE_BODY_OPTIONS, ...options || {} };

    if (request.headers['transfer-encoding'] === undefined && isNaN(parseInt(request.headers['content-length'], 10))) {
      return resolve(undefined);
    }

    // The Content-Length header is mandatory for messages with entity bodies,
    // unless the message is transported using chunked encoding (transfer-encoding).
    if (request.headers['transfer-encoding'] === undefined && request.headers['content-length'] === undefined) {
      return reject(new HttpException(411, `Length Required`));
    }

    // content-length header limit check
    const contentLength = parseInt(request.headers['content-length'], 10);

    if (contentLength && contentLength > options?.limit) {
      return reject(new HttpException(413, `Payload Too Large`));
    }

    let requestStream: stream.Stream = request as stream.Stream;

    // content-encoding
    const encoding = request.headers['content-encoding']?.toLowerCase();

    if (encoding) {
      switch (encoding) {
        case 'deflate':
          requestStream = requestStream.pipe(zlib.createInflate());
          break;
        case 'gzip':
          requestStream = requestStream.pipe(zlib.createGunzip());
          break;
        default:
          return reject(new HttpException(415, `Unsupported content-encoding: ${ encoding }`));
      }
    }

    // data
    let data: Buffer = Buffer.alloc(0);

    requestStream.on('data', (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);

      // buffer length limit check
      if (data.length > options?.limit) {
        return reject(new HttpException(413, `Payload too large`));
      }
    });

    requestStream.on('end', () => {
      // content-length header check with buffer length
      if (contentLength && contentLength !== data.length) {
        return reject(new HttpException(400, 'Request size did not match Content-Length'));
      }

      const mimeType = getContentTypeMime(request.headers['content-type']);
      const mimeTypeParser: Parser | undefined = parsers.get(mimeType);

      if (!mimeTypeParser) {
        return reject(new HttpException(415, `Unsupported Media Type: ${ mimeType }`));
      }

      return resolve(mimeTypeParser(data, request.headers));
    });

    requestStream.on('error', error => {
      return reject(error);
    });
  });
}

export interface File {
  data: Buffer;
  fileName?: string;
  mimeType?: string;
  name?: string;
}

export interface ParseBodyOptions {
  limit?: number;
}

export interface Parser {
  (buffer: Buffer, headers: http.IncomingHttpHeaders): any;
}
