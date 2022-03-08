import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Delete(...interceptors: DeleteInterceptor[]): MethodDecorator;
export function Delete(path?: string, ...interceptors: DeleteInterceptor[]): MethodDecorator;
export function Delete(...args: any[]): MethodDecorator {
  const interceptors: DeleteInterceptor[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: interceptors.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        interceptor: typeof it === 'function' ? it : it.interceptor,
      })),
      method: 'DELETE',
      path: path || '',
    });
  };
}

export type DeleteInterceptor = Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; };
