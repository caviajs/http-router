import { Injectable, Type } from '@caviajs/core';
import { Interceptor } from '../types/interceptor';
import { HttpReflector } from '../http-reflector';

export function Controller(options?: ControllerOptions): ClassDecorator;
export function Controller(prefix?: string, options?: ControllerOptions): ClassDecorator;
export function Controller(...args: any[]): ClassDecorator {
  return target => {
    const options: ControllerOptions | undefined = args.find(it => typeof it === 'object');
    const prefix: string | undefined = args.find(it => typeof it === 'string');

    HttpReflector.addControllerMetadata(target, {
      interceptors: (options?.interceptors || []).map(it => typeof it === 'function' ? { args: [], interceptor: it } : {
        args: it.args || [],
        interceptor: it.interceptor,
      }),
      prefix: prefix || '',
    });

    Reflect.decorate([Injectable()], target);
  };
}

export interface ControllerOptions {
  interceptors?: (Type<Interceptor> | { args?: any[]; interceptor: Type<Interceptor>; })[];
}
