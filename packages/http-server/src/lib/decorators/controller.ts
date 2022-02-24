import { Injectable } from '@caviajs/core';

export const CONTROLLER_METADATA = Symbol('CONTROLLER_METADATA');

export function getControllerMetadata(target: object): ControllerMetadata | undefined {
  return Reflect.getMetadata(CONTROLLER_METADATA, target);
}

export function hasControllerMetadata(target: object): boolean {
  return Reflect.hasMetadata(CONTROLLER_METADATA, target);
}

export function Controller(prefix?: string): ClassDecorator {
  return target => {
    const value: ControllerMetadata = {
      prefix: prefix,
    };

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CONTROLLER_METADATA, value, target);
  };
}

export interface ControllerMetadata {
  prefix?: string;
}
