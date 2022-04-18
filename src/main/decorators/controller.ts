import { Injectable } from './injectable';

const DEFAULT_PATH: string = '/';

export const CONTROLLER_METADATA: Symbol = Symbol('CONTROLLER_METADATA');

export function Controller(path?: string): ClassDecorator {
  return (target: Function) => {
    const controllerMetadata: ControllerMetadata = {
      path: path || DEFAULT_PATH,
    };

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CONTROLLER_METADATA, controllerMetadata, target);
  };
}

export interface ControllerOptions {
  path?: string;
}

export type ControllerMetadata = ControllerOptions;
