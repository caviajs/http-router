import { Injectable } from '@caviajs/core';

const DEFAULT_PREFIX: string = '/';

export const CONTROLLER_PATH_METADATA: Symbol = Symbol('CONTROLLER_PATH_METADATA');

export function Controller(prefix?: string | string[]): ClassDecorator {
  return (target: Function) => {
    const controllerPathMetadata: ControllerPathMetadata = prefix || DEFAULT_PREFIX;

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CONTROLLER_PATH_METADATA, controllerPathMetadata, target);
  };
}

export type ControllerPathMetadata = string | string[];
