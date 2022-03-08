import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Patch(...interceptors: PatchInterceptor[]): MethodDecorator;
export function Patch(path?: string, ...interceptors: PatchInterceptor[]): MethodDecorator;
export function Patch(...args: any[]): MethodDecorator {
  const interceptors: PatchInterceptor[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: interceptors.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        interceptor: typeof it === 'function' ? it : it.interceptor,
      })),
      method: 'PATCH',
      path: path || '',
    });
  };
}

export type PatchInterceptor = Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; };
