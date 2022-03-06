import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Put(options?: PutOptions): MethodDecorator;
export function Put(path?: string, options?: PutOptions): MethodDecorator;
export function Put(...args: any[]): MethodDecorator {
  const options: PutOptions | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target, propertyKey, {
      interceptors: options?.interceptors?.map(it => typeof it === 'function' ? { interceptor: it } : it) || [],
      method: 'PUT',
      path: path || '',
    });
  };
}

export interface PutOptions {
  interceptors?: (Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; })[];
}
