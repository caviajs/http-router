import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Interceptor } from '../types/interceptor';

export function UseInterceptor(interceptor: Type<Interceptor>, args?: any[]): ClassDecorator | MethodDecorator {
  return (target: Function, propertyKey: string, descriptor?) => {
    if (descriptor) {
      HttpReflector.addRouteInterceptorMetadata(target.constructor, propertyKey, {
        args: args || [],
        interceptor: interceptor,
      });

      return;
    }

    HttpReflector.addControllerInterceptorMetadata(target, {
      args: args || [],
      interceptor: interceptor,
    });
  };
}
