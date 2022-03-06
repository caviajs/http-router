import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Get(options?: GetOptions): MethodDecorator;
export function Get(path?: string, options?: GetOptions): MethodDecorator;
export function Get(...args: any[]): MethodDecorator {
  const options: GetOptions | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: (options?.interceptors || []).map(it => typeof it === 'function' ? { args: [], interceptor: it } : {
        args: it.args || [],
        interceptor: it.interceptor,
      }),
      method: 'GET',
      path: path || '',
    });
  };
}

export interface GetOptions {
  interceptors?: (Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; })[];
}
