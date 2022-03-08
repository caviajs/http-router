import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Head(...interceptors: HeadInterceptor[]): MethodDecorator;
export function Head(path?: string, ...interceptors: HeadInterceptor[]): MethodDecorator;
export function Head(...args: any[]): MethodDecorator {
  const interceptors: HeadInterceptor[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: interceptors.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        interceptor: typeof it === 'function' ? it : it.interceptor,
      })),
      method: 'HEAD',
      path: path || '',
    });
  };
}

export type HeadInterceptor = Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; };
