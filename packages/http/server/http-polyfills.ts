import { Schema } from '@caviajs/core';
import http from 'http';

declare module 'http' {
  export interface IncomingMessage {
    meta: {
      requestBodySchema: Schema | undefined;
      requestCookiesSchema: Schema | undefined;
      requestHeadersSchema: Schema | undefined;
      requestParamsSchema: Schema | undefined;
      requestQuerySchema: Schema | undefined;
      responseBodySchema: Schema | undefined;
      responseHeadersSchema: Schema | undefined;
    };
    params: Record<string, string>;
    path: string | undefined;
  }
}

http.IncomingMessage.prototype.meta = {
  requestBodySchema: undefined,
  requestCookiesSchema: undefined,
  requestHeadersSchema: undefined,
  requestParamsSchema: undefined,
  requestQuerySchema: undefined,
  responseBodySchema: undefined,
  responseHeadersSchema: undefined,
};
http.IncomingMessage.prototype.params = {};
http.IncomingMessage.prototype.path = undefined;
