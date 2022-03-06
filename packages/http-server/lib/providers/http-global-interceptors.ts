import { Token, Type, ValueProvider } from '@caviajs/core';

import { Interceptor } from '../types/interceptor';

/**
 * A provider token that represents the array of global registered HttpInterceptor objects.
 */
export const HTTP_GLOBAL_INTERCEPTORS: Token<HttpGlobalInterceptors> = Symbol('HTTP_GLOBAL_INTERCEPTORS');

export const HttpGlobalInterceptorsProvider: ValueProvider<HttpGlobalInterceptors> = {
  provide: HTTP_GLOBAL_INTERCEPTORS,
  useValue: [],
};

export type HttpGlobalInterceptors = { args: any[]; interceptor: Type<Interceptor>; }[];
