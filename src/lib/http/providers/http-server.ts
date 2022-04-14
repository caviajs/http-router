import http from 'http';
import https from 'https';
import { Token } from '../../ioc/types/token';
import { ValueProvider } from '../../ioc/types/provider';

export const HTTP_SERVER: Token<HttpServer> = Symbol('HTTP_SERVER');

export const HttpServerProvider: ValueProvider<HttpServer> = {
  provide: HTTP_SERVER,
  useValue: http.createServer(),
};

export type HttpServer = http.Server | https.Server;
