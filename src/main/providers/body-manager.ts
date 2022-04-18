import iconv from 'iconv-lite';
import qs from 'qs';
import * as multipart from 'parse-multipart-data';
import { Injectable } from '../decorators/injectable';
import { Body } from './body';
import { OnApplicationBoot } from '../types/hooks';
import { HttpException } from '../exceptions/http-exception';
import { File } from '../types/file';
import { Headers } from './headers';

@Injectable()
export class BodyManager implements OnApplicationBoot {
  constructor(
    protected readonly body: Body,
    protected readonly headers: Headers,
  ) {
  }

  public onApplicationBoot(): void {
    this.body.mimeTypeParsers.set('application/json', (buffer, headers) => {
      const charset: string | undefined = this.headers.contentType.getParameter(headers['content-type'], 'charset');

      if (charset && !iconv.encodingExists(charset)) {
        throw new HttpException(415, `Unsupported charset: ${ charset }`);
      }

      return JSON.parse(charset ? iconv.decode(buffer, charset) : buffer.toString());
    });

    this.body.mimeTypeParsers.set('application/x-www-form-urlencoded', (buffer, headers) => {
      const charset: string | undefined = this.headers.contentType.getParameter(headers['content-type'], 'charset');

      if (charset && !iconv.encodingExists(charset)) {
        throw new HttpException(415, `Unsupported charset: ${ charset }`);
      }

      return qs.parse(charset ? iconv.decode(buffer, charset) : buffer.toString(), { allowDots: true });
    });

    this.body.mimeTypeParsers.set('multipart/form-data', (buffer, headers) => {
      const boundary: string | undefined = this.headers.contentType.getParameter(headers['content-type'], 'boundary');

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
    });

    this.body.mimeTypeParsers.set('text/plain', (buffer, headers) => {
      const charset: string | undefined = this.headers.contentType.getParameter(headers['content-type'], 'charset');

      if (charset && !iconv.encodingExists(charset)) {
        throw new HttpException(415, `Unsupported charset: ${ charset }`);
      }

      return charset ? iconv.decode(buffer, charset) : buffer.toString();
    });
  }
}
