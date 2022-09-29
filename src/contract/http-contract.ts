import { HttpException } from '../exception/http-exception';
import { Interceptor, Next } from '../router/http-router';
import http from 'http';
import iconv from 'iconv-lite';
import { Observable, exhaustMap, of } from 'rxjs';
import { Readable } from 'stream';
import * as url from 'url';
import { convertToBoolean } from '../utils/convert-to-boolean';
import { convertToNumber } from '../utils/convert-to-number';
import { getContentTypeMime } from './get-content-type-mime';
import { getContentTypeParameter } from './get-content-type-parameter';
import { isSchemaArray, validateSchemaArray } from './schema-array';
import { isSchemaBoolean, validateSchemaBoolean } from './schema-boolean';
import { isSchemaBuffer, validateSchemaBuffer } from './schema-buffer';
import { isSchemaEnum, validateSchemaEnum } from './schema-enum';
import { isSchemaNumber, validateSchemaNumber } from './schema-number';
import { isSchemaObject, validateSchemaObject } from './schema-object';
import { isSchemaStream, validateSchemaStream } from './schema-stream';
import { isSchemaString, validateSchemaString } from './schema-string';
import { ValidationError } from './validation-error';

const CONTENT_PARSERS: { [mime: string]: (request: http.IncomingMessage) => Promise<any>; } = {
  /** application/json **/
  'application/json:array': async request => {
    return await convertRequestBodyTo(request, 'json');
  },
  'application/json:boolean': async request => {
    return await convertRequestBodyTo(request, 'json');
  },
  'application/json:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'application/json:number': async request => {
    return await convertRequestBodyTo(request, 'json');
  },
  'application/json:object': async request => {
    return await convertRequestBodyTo(request, 'json');
  },
  'application/json:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** application/octet-stream **/
  'application/octet-stream:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'application/octet-stream:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** application/pdf **/
  'application/pdf:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'application/pdf:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** application/x-www-form-urlencoded **/
  'application/x-www-form-urlencoded:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'application/x-www-form-urlencoded:object': async request => {
    return url.parse(`?${ await convertRequestBodyTo(request, 'string') }`, true).query;
  },
  'application/x-www-form-urlencoded:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** application/xml **/
  'application/xml:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'application/xml:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },
  'application/xml:string': async request => {
    return await convertRequestBodyTo(request, 'string');
  },

  /** image/gif **/
  'image/gif:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'image/gif:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** image/jpeg **/
  'image/jpeg:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'image/jpeg:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** image/png **/
  'image/png:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'image/png:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** image/tiff **/
  'image/tiff:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'image/tiff:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** multipart/form-data **/
  'multipart/form-data:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'multipart/form-data:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },

  /** text/css **/
  'text/css:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'text/css:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },
  'text/css:string': async request => {
    return await convertRequestBodyTo(request, 'string');
  },

  /** text/csv **/
  'text/csv:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'text/csv:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },
  'text/csv:string': async request => {
    return await convertRequestBodyTo(request, 'string');
  },

  /** text/html **/
  'text/html:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'text/html:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },
  'text/html:string': async request => {
    return await convertRequestBodyTo(request, 'string');
  },

  /** text/plain **/
  'text/plain:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'text/plain:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },
  'text/plain:string': async request => {
    return await convertRequestBodyTo(request, 'string');
  },

  /** video/mp4 **/
  'video/mp4:buffer': async request => {
    return await convertRequestBodyTo(request, 'buffer');
  },
  'video/mp4:stream': async request => {
    return await convertRequestBodyTo(request, 'stream');
  },
};

export class HttpContract {
  public static setup(): Interceptor {
    return async (request: http.IncomingMessage, response: http.ServerResponse, next: Next): Promise<Observable<any>> => {
      const errors: ValidationError[] = [];

      /** request.body **/
      if (request.metadata?.contract?.request?.body) {
        const contentTypeMime: string | undefined = getContentTypeMime(request.headers['content-type']);

        const contentSchema = request.metadata.contract.request.body[contentTypeMime?.toLowerCase()];
        const contentParser = CONTENT_PARSERS[`${ contentTypeMime }:${ contentSchema?.type }`];

        if (!contentSchema || !contentParser) {
          throw new HttpException(415); // Unsupported Media Type
        }

        request.body = await contentParser(request);

        const path: string[] = ['request', 'body'];

        if (isSchemaArray(contentSchema)) {
          errors.push(...validateSchemaArray(contentSchema, request.body, path));
        } else if (isSchemaBoolean(contentSchema)) {
          errors.push(...validateSchemaBoolean(contentSchema, request.body, path));
        } else if (isSchemaBuffer(contentSchema)) {
          errors.push(...validateSchemaBuffer(contentSchema, request.body, path));
        } else if (isSchemaEnum(contentSchema)) {
          errors.push(...validateSchemaEnum(contentSchema, request.body, path));
        } else if (isSchemaNumber(contentSchema)) {
          errors.push(...validateSchemaNumber(contentSchema, request.body, path));
        } else if (isSchemaObject(contentSchema)) {
          errors.push(...validateSchemaObject(contentSchema, request.body, path));
        } else if (isSchemaStream(contentSchema)) {
          errors.push(...validateSchemaStream(contentSchema, request.body, path));
        } else if (isSchemaString(contentSchema)) {
          errors.push(...validateSchemaString(contentSchema, request.body, path));
        } else {
          throw new HttpException(500);
        }
      }

      /** request.headers **/
      if (request.metadata?.contract?.request?.headers) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.headers)) {
          const path: string[] = ['request', 'headers', name];

          if (isSchemaEnum(schema)) {
            errors.push(...validateSchemaEnum(schema, request.headers[name], path));
          } else if (isSchemaString(schema)) {
            errors.push(...validateSchemaString(schema, request.headers[name], path));
          } else {
            throw new HttpException(500);
          }
        }
      }

      /** request.params **/
      if (request.metadata?.contract?.request?.params) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.params)) {
          const path: string[] = ['request', 'params', name];

          if (isSchemaBoolean(schema)) {
            if (typeof request.params[name] !== 'undefined') {
              request.params[name] = convertToBoolean(request.params[name]);
            }

            errors.push(...validateSchemaBoolean(schema, request.params[name], path));
          } else if (isSchemaEnum(schema)) {
            errors.push(...validateSchemaEnum(schema, request.params[name], path));
          } else if (isSchemaNumber(schema)) {
            if (typeof request.params[name] !== 'undefined') {
              request.params[name] = convertToNumber(request.params[name]);
            }

            errors.push(...validateSchemaNumber(schema, request.params[name], path));
          } else if (isSchemaString(schema)) {
            errors.push(...validateSchemaString(schema, request.params[name], path));
          } else {
            throw new HttpException(500);
          }
        }
      }

      /** request.query **/
      request.query = url.parse(request.url, true).query as any;

      if (request.metadata?.contract?.request?.query) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.query)) {
          const path: string[] = ['request', 'query', name];

          if (isSchemaBoolean(schema)) {
            if (typeof request.query[name] !== 'undefined') {
              request.query[name] = convertToBoolean(request.query[name]);
            }

            errors.push(...validateSchemaBoolean(schema, request.query[name], path));
          } else if (isSchemaEnum(schema)) {
            errors.push(...validateSchemaEnum(schema, request.query[name], path));
          } else if (isSchemaNumber(schema)) {
            if (typeof request.query[name] !== 'undefined') {
              request.query[name] = convertToNumber(request.query[name]);
            }

            errors.push(...validateSchemaNumber(schema, request.query[name], path));
          } else if (isSchemaString(schema)) {
            errors.push(...validateSchemaString(schema, request.query[name], path));
          } else {
            throw new HttpException(500);
          }
        }
      }

      if (errors.length > 0) {
        throw new HttpException(400, errors);
      }

      return next
        .handle()
        .pipe(
          exhaustMap((responseBody: any) => {
            const errors: ValidationError[] = [];

            if (request.metadata?.contract?.responses) {
              const responseBodySchema = request.metadata?.contract?.responses[response.statusCode]?.body;
              const responseHeadersSchema = request.metadata?.contract?.responses[response.statusCode]?.headers;

              /** response.body **/
              if (responseBodySchema) {
                const path: string[] = ['response', 'body'];

                if (isSchemaArray(responseBodySchema)) {
                  errors.push(...validateSchemaArray(responseBodySchema, responseBody, path));
                } else if (isSchemaBoolean(responseBodySchema)) {
                  errors.push(...validateSchemaBoolean(responseBodySchema, responseBody, path));
                } else if (isSchemaBuffer(responseBodySchema)) {
                  errors.push(...validateSchemaBuffer(responseBodySchema, responseBody, path));
                } else if (isSchemaEnum(responseBodySchema)) {
                  errors.push(...validateSchemaEnum(responseBodySchema, responseBody, path));
                } else if (isSchemaNumber(responseBodySchema)) {
                  errors.push(...validateSchemaNumber(responseBodySchema, responseBody, path));
                } else if (isSchemaObject(responseBodySchema)) {
                  errors.push(...validateSchemaObject(responseBodySchema, responseBody, path));
                } else if (isSchemaStream(responseBodySchema)) {
                  errors.push(...validateSchemaStream(responseBodySchema, responseBody, path));
                } else if (isSchemaString(responseBodySchema)) {
                  errors.push(...validateSchemaString(responseBodySchema, responseBody, path));
                } else {
                  throw new HttpException(500);
                }
              }

              /** response.headers **/
              if (responseHeadersSchema) {
                for (const [name, schema] of Object.entries(responseHeadersSchema)) {
                  const path: string[] = ['response', 'headers', name];

                  if (isSchemaEnum(schema)) {
                    errors.push(...validateSchemaEnum(schema, response.getHeader(name), path));
                  } else if (isSchemaString(schema)) {
                    errors.push(...validateSchemaString(schema, response.getHeader(name), path));
                  } else {
                    throw new HttpException(500);
                  }
                }
              }
            }

            if (errors.length > 0) {
              throw new HttpException(500, errors);
            }

            return of(responseBody);
          }),
        );
    };
  }
}

async function convertRequestBodyTo(request: http.IncomingMessage, outputType: 'stream'): Promise<Readable | undefined>;
async function convertRequestBodyTo(request: http.IncomingMessage, outputType: 'buffer'): Promise<Buffer | undefined>;
async function convertRequestBodyTo(request: http.IncomingMessage, outputType: 'json'): Promise<any | undefined>;
async function convertRequestBodyTo(request: http.IncomingMessage, outputType: 'string'): Promise<string | undefined>;
async function convertRequestBodyTo(request: http.IncomingMessage, outputType: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (request.headers['transfer-encoding'] === undefined && isNaN(parseInt(request.headers['content-length'], 10))) {
      return resolve(undefined);
    }

    // The Content-Length header is mandatory for messages with entity bodies,
    // unless the message is transported using chunked encoding (transfer-encoding).
    if (request.headers['transfer-encoding'] === undefined && request.headers['content-length'] === undefined) {
      return reject(new HttpException(411, `Length Required`));
    }

    if (outputType === 'stream') {
      return resolve(request);
    }

    // data
    let data: Buffer = Buffer.alloc(0);

    request.on('data', (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);
    });

    request.on('end', () => {
      // content-length header check with buffer length
      const contentLength: number = parseInt(request.headers['content-length'], 10);

      if (contentLength && contentLength !== data.length) {
        return reject(new HttpException(400, 'Request size did not match Content-Length'));
      }

      const contentTypeCharset: string | undefined = getContentTypeParameter(request.headers['content-type'], 'charset');

      if (contentTypeCharset && !iconv.encodingExists(contentTypeCharset)) {
        return Promise.reject(new HttpException(415, `Unsupported charset: ${ contentTypeCharset }`));
      }

      switch (outputType) {
        case 'buffer':
          return resolve(data);
        case 'json':
          try {
            return resolve(JSON.parse(contentTypeCharset ? iconv.decode(data, contentTypeCharset) : data.toString()));
          } catch (err) {
            return reject(new HttpException(422)); // Unprocessable Entity
          }
        case 'string':
          return resolve(contentTypeCharset ? iconv.decode(data, contentTypeCharset) : data.toString());
      }
    });

    request.on('error', error => {
      return reject(error);
    });
  });
}
