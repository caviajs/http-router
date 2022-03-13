import { Injectable } from '@caviajs/core';

const DEFAULT_PATH: string = '/';

export const CONTROLLER_PATH_METADATA: Symbol = Symbol('CONTROLLER_PATH_METADATA');

export function Controller(path?: string | string[]): ClassDecorator {
  return (target: Function) => {
    const controllerPathMetadata: ControllerPathMetadata = Array.isArray(path) ? path : [path || DEFAULT_PATH];

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CONTROLLER_PATH_METADATA, controllerPathMetadata, target);
  };
}

export type ControllerPathMetadata = string[];
