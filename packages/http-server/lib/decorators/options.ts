import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Options(...interceptors: OptionsInterceptor[]): MethodDecorator;
export function Options(path?: string, ...interceptors: OptionsInterceptor[]): MethodDecorator;
export function Options(...args: any[]): MethodDecorator {
  const interceptors: OptionsInterceptor[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: interceptors.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        interceptor: typeof it === 'function' ? it : it.interceptor,
      })),
      method: 'OPTIONS',
      path: path || '',
    });
  };
}

export type OptionsInterceptor = Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; };
