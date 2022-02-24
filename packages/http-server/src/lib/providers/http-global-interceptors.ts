import { Token, Type, ValueProvider } from '@caviajs/core';

import { Interceptor } from '../types/interceptor';

/**
 * A provider token that represents the array of global registered HttpInterceptor objects.
 */
export const HTTP_GLOBAL_INTERCEPTORS: Token<HttpGlobalInterceptors> = Symbol('HTTP_GLOBAL_INTERCEPTORS');

export function createHttpGlobalInterceptorsProvider(interceptors: Type<Interceptor>[]): ValueProvider<HttpGlobalInterceptors> {
  return {
    provide: HTTP_GLOBAL_INTERCEPTORS,
    useValue: interceptors,
  };
}

export type HttpGlobalInterceptors = Type<Interceptor>[];
