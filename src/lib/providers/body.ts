import zlib from 'zlib';
import stream from 'stream';
import { HttpException } from '../http-exception';
import { Request } from '../types/request';
import { MimeType } from './mime-type';
import { Injectable } from '../decorators/injectable';

const DEFAULT_PARSE_BODY_OPTIONS: ParseBodyOptions = {
  limit: 1048576, // 10 Mbits
};

@Injectable()
export class Body {
  constructor(
    protected readonly mimeType: MimeType,
  ) {
  }

  public async parseBody<T = any>(request: Request, options?: ParseBodyOptions): Promise<T> {
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

        return resolve(this.mimeType.parseBuffer(data, request.headers));
      });

      requestStream.on('error', error => {
        return reject(error);
      });
    });
  }
}

export interface ParseBodyOptions {
  limit?: number;
}
