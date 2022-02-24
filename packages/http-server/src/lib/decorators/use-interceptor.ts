import { Type } from '@caviajs/core';

import { Interceptor } from '../types/interceptor';

export const USE_INTERCEPTOR_METADATA = Symbol('USE_INTERCEPTOR_METADATA');

export function getUseInterceptorMetadata(target: object): UseInterceptorMetadata[] | undefined {
  return Reflect.getMetadata(USE_INTERCEPTOR_METADATA, target);
}

export function hasUseInterceptorMetadata(target: object): boolean {
  return Reflect.hasMetadata(USE_INTERCEPTOR_METADATA, target);
}

export function UseInterceptor(interceptor: Type<Interceptor>, ...args: any[]): MethodDecorator | ClassDecorator {
  return (target, propertyKey?, descriptor?) => {
    const ref = descriptor ? descriptor.value : target;

    const value: UseInterceptorMetadata[] = [...(getUseInterceptorMetadata(ref) || []), {
      args: args,
      interceptor: interceptor,
    }];

    Reflect.defineMetadata(USE_INTERCEPTOR_METADATA, value, ref);
  };
}

export interface UseInterceptorMetadata {
  args: any[];
  // descriptor: TypedPropertyDescriptor<any>;
  interceptor: Type<Interceptor>;
}
