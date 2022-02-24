import { Injectable } from '@caviajs/core';
import zlib from 'zlib';
import stream from 'stream';

import { Next, Interceptor } from '../types/interceptor';
import { MimeTypeParser } from '../providers/mime-type-parser';
import { getContentTypeMime } from '../utils/get-content-type-mime';
import { HttpException } from '../http-exception';
import { Request } from '../types/request';
import { Response } from '../types/response';

declare module 'http' {
  export interface IncomingMessage {
    body?: any;
  }
}

const DEFAULT_PARSE_OPTIONS: ParseOptions = {
  limit: 1048576, // 10 Mbits
};

@Injectable()
export class BodyParserInterceptor implements Interceptor {
  constructor(
    private readonly mimeTypeParser: MimeTypeParser,
  ) {
  }

  public async intercept(request: Request, response: Response, next: Next) {
    request.body = await this.parse(request);

    return next.handle();
  }

  protected async parse<T = any>(request: Request, options?: ParseOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      options = { ...DEFAULT_PARSE_OPTIONS, ...options || {} };

      if (request.headers['transfer-encoding'] === undefined && isNaN(parseInt(request.headers['content-length'], 10))) {
        return resolve(undefined);
      }

      const mimeType = getContentTypeMime(request.headers['content-type']);

      if (!this.mimeTypeParser.has(mimeType)) {
        throw new HttpException(415, `Unsupported Media Type: ${ mimeType }`);
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

      let stream: stream.Stream = request as stream.Stream;

      // content-encoding
      const encoding = request.headers['content-encoding']?.toLowerCase();

      if (encoding) {
        switch (encoding) {
          case 'deflate':
            stream = stream.pipe(zlib.createInflate());
            break;
          case 'gzip':
            stream = stream.pipe(zlib.createGunzip());
            break;
          default:
            return reject(new HttpException(415, `Unsupported content-encoding: ${ encoding }`));
        }
      }

      // data
      let data: Buffer = Buffer.alloc(0);

      stream.on('data', (chunk: Buffer) => {
        data = Buffer.concat([data, chunk]);

        // buffer length limit check
        if (data.length > options?.limit) {
          return reject(new HttpException(413, `Payload too large`));
        }
      });

      stream.on('end', () => {
        // content-length header check with buffer length
        if (contentLength && contentLength !== data.length) {
          return reject(new HttpException(400, 'Request size did not match Content-Length'));
        }

        return resolve(this.mimeTypeParser.get(mimeType)(data, request.headers));
      });

      stream.on('error', error => {
        return reject(error);
      });
    });
  }
}

export interface ParseOptions {
  limit?: number;
}
