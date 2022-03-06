import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Delete(options?: DeleteOptions): MethodDecorator;
export function Delete(path?: string, options?: DeleteOptions): MethodDecorator;
export function Delete(...args: any[]): MethodDecorator {
  const options: DeleteOptions | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target, propertyKey, {
      interceptors: options?.interceptors?.map(it => typeof it === 'function' ? { interceptor: it } : it) || [],
      method: 'DELETE',
      path: path || '',
    });
  };
}

export interface DeleteOptions {
  interceptors?: (Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; })[];
}
