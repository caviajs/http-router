import { Type } from '@caviajs/core';
import { Interceptor } from '../types/interceptor';

export const USE_INTERCEPTOR_METADATA: Symbol = Symbol('USE_INTERCEPTOR');

export function UseInterceptor(interceptor: Type<Interceptor>, args?: any[]): ClassDecorator | MethodDecorator {
  return (target: Function, propertyKey?: string, descriptor?: TypedPropertyDescriptor<any>) => {
    const targetRef = descriptor ? target.constructor : target;
    const targetKey = descriptor ? propertyKey : undefined;

    const useInterceptorMetadata: UseInterceptorMetadata = (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, targetRef, targetKey) || []).push({
      args: args || [],
      interceptor: interceptor,
    });

    Reflect.defineMetadata(USE_INTERCEPTOR_METADATA, useInterceptorMetadata, targetRef, targetKey);
  };
}

export type UseInterceptorMetadata = { args: any[]; interceptor: Type<Interceptor>; }[];
