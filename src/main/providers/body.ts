import zlib from 'zlib';
import stream from 'stream';
import { HttpException } from '../exceptions/http-exception';
import { Request } from '../types/request';
import { Injectable } from '../decorators/injectable';
import { Parser } from '../types/parser';
import { HTTP_CONTEXT } from '../constants';
import { Logger } from './logger';
import { getContentTypeMime } from '../utils/get-content-type-mime';

const DEFAULT_PARSE_BODY_OPTIONS: ParseBodyOptions = {
  limit: 1048576, // 10 Mbits
};

@Injectable()
export class Body {
  protected readonly parsers: Parser[] = [];

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public addParser(parser: Parser): void {
    if (this.parsers.some(it => it.metadata.mimeType.toLowerCase() === parser.metadata.mimeType.toLowerCase())) {
      throw new Error(`Duplicated {${ parser.metadata.mimeType }} mime type parser`);
    }

    this.parsers.push(parser);
    this.logger.trace(`Mapped {${ parser.metadata.mimeType }} mime type parser`, HTTP_CONTEXT);
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

        const mimeType = getContentTypeMime(request.headers['content-type']);
        const mimeTypeParser: Parser | undefined = this.parsers.find(it => it.metadata.mimeType === mimeType);

        if (!mimeTypeParser) {
          return reject(new HttpException(415, `Unsupported Media Type: ${ mimeType }`));
        }

        return resolve(mimeTypeParser.parse(data, request.headers));
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
