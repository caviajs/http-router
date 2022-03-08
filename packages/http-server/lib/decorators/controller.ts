import { Injectable, Type } from '@caviajs/core';
import { Interceptor } from '../types/interceptor';
import { HttpReflector } from '../http-reflector';

export function Controller(...interceptors: ControllerInterceptor[]): ClassDecorator;
export function Controller(prefix?: string, ...interceptors: ControllerInterceptor[]): ClassDecorator;
export function Controller(...args: any[]): ClassDecorator {
  return target => {
    const interceptors: ControllerInterceptor[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
    const prefix: string | undefined = args.find(it => typeof it === 'string');

    HttpReflector.addControllerMetadata(target, {
      interceptors: interceptors.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        interceptor: typeof it === 'function' ? it : it.interceptor,
      })),
      prefix: prefix || '',
    });

    Reflect.decorate([Injectable()], target);
  };
}

export type ControllerInterceptor = Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; };
