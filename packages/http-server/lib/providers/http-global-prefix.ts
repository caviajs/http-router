import { Token, ValueProvider } from '@caviajs/core';

/**
 * A provider token that represents the global prefix.
 */
export const HTTP_GLOBAL_PREFIX: Token<HttpGlobalPrefix> = Symbol('HTTP_GLOBAL_PREFIX');

export function createHttpGlobalPrefixProvider(prefix: string): ValueProvider<HttpGlobalPrefix> {
  return {
    provide: HTTP_GLOBAL_PREFIX,
    useValue: prefix,
  };
}

export type HttpGlobalPrefix = string;

