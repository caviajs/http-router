import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Options(options?: OptionsOptions): MethodDecorator;
export function Options(path?: string, options?: OptionsOptions): MethodDecorator;
export function Options(...args: any[]): MethodDecorator {
  const options: OptionsOptions | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: (options?.interceptors || []).map(it => typeof it === 'function' ? { args: [], interceptor: it } : {
        args: it.args || [],
        interceptor: it.interceptor,
      }),
      method: 'OPTIONS',
      path: path || '',
    });
  };
}

export interface OptionsOptions {
  interceptors?: (Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; })[];
}
