import { Token, ValueProvider } from '@caviajs/core';

import http from 'http';
import https from 'https';

export const HTTP_SERVER: Token<HttpServer> = Symbol('HTTP_SERVER');

export const HttpServerProvider: ValueProvider<HttpServer> = {
  provide: HTTP_SERVER,
  useValue: http.createServer(),
};

export type HttpServer = http.Server | https.Server;
