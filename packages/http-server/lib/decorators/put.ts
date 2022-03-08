import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Put(...interceptors: PutInterceptor[]): MethodDecorator;
export function Put(path?: string, ...interceptors: PutInterceptor[]): MethodDecorator;
export function Put(...args: any[]): MethodDecorator {
  const interceptors: PutInterceptor[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: interceptors.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        interceptor: typeof it === 'function' ? it : it.interceptor,
      })),
      method: 'PUT',
      path: path || '',
    });
  };
}

export type PutInterceptor = Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; };
