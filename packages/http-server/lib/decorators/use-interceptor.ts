import { Type } from '@caviajs/core';
import { Interceptor } from '../types/interceptor';

export const USE_INTERCEPTOR_METADATA: Symbol = Symbol('USE_INTERCEPTOR');

export function UseInterceptor(interceptor: Type<Interceptor>, args?: any[]): ClassDecorator & MethodDecorator {
  return (target: Function, propertyKey?: string, descriptor?: TypedPropertyDescriptor<any>) => {
    let useInterceptorMetadata: UseInterceptorMetadata;

    if (descriptor) {
      useInterceptorMetadata = (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, target.constructor, propertyKey) || []);
    } else {
      useInterceptorMetadata = (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, target) || []);
    }

    useInterceptorMetadata.push({ args: args || [], interceptor: interceptor });

    if (descriptor) {
      Reflect.defineMetadata(USE_INTERCEPTOR_METADATA, useInterceptorMetadata, target.constructor, propertyKey);
    } else {
      Reflect.defineMetadata(USE_INTERCEPTOR_METADATA, useInterceptorMetadata, target);
    }
  };
}

export type UseInterceptorMetadata = { args: any[]; interceptor: Type<Interceptor>; }[];
