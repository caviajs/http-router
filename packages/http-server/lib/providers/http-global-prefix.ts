import { Token, ValueProvider } from '@caviajs/core';

/**
 * A provider token that represents the global prefix.
 */
export const HTTP_GLOBAL_PREFIX: Token<HttpGlobalPrefix> = Symbol('HTTP_GLOBAL_PREFIX');

export const HttpGlobalPrefixProvider: ValueProvider<HttpGlobalPrefix> = {
  provide: HTTP_GLOBAL_PREFIX,
  useValue: '',
};

export type HttpGlobalPrefix = string;

