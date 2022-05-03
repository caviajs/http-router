import { Injectable } from '../decorators/injectable';
import { Stream } from 'stream';
import { readable } from 'is-stream';
import { Response } from '../types/response';

@Injectable()
export class HttpServerSerializer {
  public serialize(response: Response, data: any): void {
    if (data === undefined) {
      response
        .writeHead(response.statusCode || 204)
        .end();
    } else if (Buffer.isBuffer(data)) {
      response
        .writeHead(response.statusCode || 200, {
          'Content-Length': response.getHeader('Content-Length') || data.length,
          'Content-Type': response.getHeader('Content-Type') || 'application/octet-stream',
        })
        .end(data);
    } else if (data instanceof Stream || readable(data)) {
      response
        .writeHead(response.statusCode || 200, {
          'Content-Type': response.getHeader('Content-Type') || 'application/octet-stream',
        });

      data.pipe(response);
    } else if (typeof data === 'string') {
      response
        .writeHead(response.statusCode || 200, {
          'Content-Length': response.getHeader('Content-Length') || Buffer.byteLength(data),
          'Content-Type': response.getHeader('Content-Type') || 'text/plain',
        })
        .end(data);
    } else if (typeof data === 'boolean' || typeof data === 'number' || typeof data === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      const raw: string = JSON.stringify(data);

      response
        .writeHead(response.statusCode || 200, {
          'Content-Length': response.getHeader('Content-Length') || Buffer.byteLength(raw),
          'Content-Type': response.getHeader('Content-Type') || 'application/json; charset=utf-8',
        })
        .end(raw);
    }
  }
}
