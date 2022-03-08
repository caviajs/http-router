import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Get(...interceptors: GetInterceptor[]): MethodDecorator;
export function Get(path?: string, ...interceptors: GetInterceptor[]): MethodDecorator;
export function Get(...args: any[]): MethodDecorator {
  const interceptors: GetInterceptor[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: interceptors.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        interceptor: typeof it === 'function' ? it : it.interceptor,
      })),
      method: 'GET',
      path: path || '',
    });
  };
}

export type GetInterceptor = Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; };
