import { Injectable, Type } from '@caviajs/core';

import { Interceptor } from '../types/interceptor';

export const CONTROLLER_METADATA = Symbol('CONTROLLER_METADATA');

export function getControllerMetadata(target: object): ControllerMetadata | undefined {
  return Reflect.getMetadata(CONTROLLER_METADATA, target);
}

export function hasControllerMetadata(target: object): boolean {
  return Reflect.hasMetadata(CONTROLLER_METADATA, target);
}

export function Controller(options?: ControllerOptions): ClassDecorator;
export function Controller(prefix?: string, options?: ControllerOptions): ClassDecorator;
export function Controller(...args: any[]): ClassDecorator {
  return target => {
    const options: ControllerOptions | undefined = args.find(it => typeof it === 'object');
    const prefix: string | undefined = args.find(it => typeof it === 'string');

    const value: ControllerMetadata = {
      interceptors: options?.interceptors,
      prefix: prefix,
    };

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CONTROLLER_METADATA, value, target);
  };
}

export interface ControllerInterceptorBinding {
  args?: any[];
  interceptor: Type<Interceptor>;
}

export interface ControllerMetadata extends ControllerOptions {
  prefix?: string;
}

export interface ControllerOptions {
  interceptors?: Array<Type<Interceptor> | ControllerInterceptorBinding>;
}
