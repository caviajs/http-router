import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Head(options?: HeadOptions): MethodDecorator;
export function Head(path?: string, options?: HeadOptions): MethodDecorator;
export function Head(...args: any[]): MethodDecorator {
  const options: HeadOptions | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target, propertyKey, {
      interceptors: (options?.interceptors || []).map(it => typeof it === 'function' ? { args: [], interceptor: it } : {
        args: it.args || [],
        interceptor: it.interceptor,
      }),
      method: 'HEAD',
      path: path || '',
    });
  };
}

export interface HeadOptions {
  interceptors?: (Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; })[];
}
