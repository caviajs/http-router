import { Token, ValueProvider } from '@caviajs/core';

export const HTTP_SERVER_PORT: Token<HttpServerPort> = Symbol('HTTP_SERVER_PORT');

export const httpServerPortProvider: ValueProvider<HttpServerPort> = {
  provide: HTTP_SERVER_PORT,
  useValue: 3000,
};

export type HttpServerPort = number;
