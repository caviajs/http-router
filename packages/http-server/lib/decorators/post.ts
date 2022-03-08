import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Post(...interceptors: PostInterceptor[]): MethodDecorator;
export function Post(path?: string, ...interceptors: PostInterceptor[]): MethodDecorator;
export function Post(...args: any[]): MethodDecorator {
  const interceptors: PostInterceptor[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      interceptors: interceptors.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        interceptor: typeof it === 'function' ? it : it.interceptor,
      })),
      method: 'POST',
      path: path || '',
    });
  };
}

export type PostInterceptor = Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; };
