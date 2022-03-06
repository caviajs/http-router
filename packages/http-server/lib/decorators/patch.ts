import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function Patch(options?: PatchOptions): MethodDecorator;
export function Patch(path?: string, options?: PatchOptions): MethodDecorator;
export function Patch(...args: any[]): MethodDecorator {
  const options: PatchOptions | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target, propertyKey, {
      interceptors: (options?.interceptors || []).map(it => typeof it === 'function' ? { args: [], interceptor: it } : {
        args: it.args || [],
        interceptor: it.interceptor,
      }),
      method: 'PATCH',
      path: path || '',
    });
  };
}

export interface PatchOptions {
  interceptors?: (Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; })[];
}
