import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Post(options?: PostOptions): MethodDecorator;
export function Post(path?: string, options?: PostOptions): MethodDecorator;
export function Post(...args: any[]): MethodDecorator {
  const options: PostOptions | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target, propertyKey, {
      interceptors: options?.interceptors?.map(it => typeof it === 'function' ? { interceptor: it } : it) || [],
      method: 'POST',
      path: path || '',
    });
  };
}

export interface PostOptions {
  interceptors?: (Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; })[];
}
