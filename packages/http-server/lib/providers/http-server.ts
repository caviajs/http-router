import { FactoryProvider, Token } from '@caviajs/core';

import http from 'http';
import https from 'https';

export const HTTP_SERVER: Token<HttpServer> = Symbol('HTTP_SERVER');

export const HttpServerProvider: FactoryProvider<HttpServer> = {
  provide: HTTP_SERVER,
  useFactory: (): HttpServer => {
    return http.createServer();
  },
};

export type HttpServer = http.Server | https.Server;
