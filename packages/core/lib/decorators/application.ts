import { Package } from '../types/package';
import { Provider } from '../types/provider';
import { Injectable } from './injectable';

export const APPLICATION_METADATA = Symbol('APPLICATION_METADATA');

export function getApplicationMetadata(target: object): ApplicationMetadata | undefined {
  return Reflect.getMetadata(APPLICATION_METADATA, target);
}

export function hasApplicationMetadata(target: object): boolean {
  return Reflect.hasMetadata(APPLICATION_METADATA, target);
}

export function Application(options?: ApplicationOptions): ClassDecorator {
  return target => {
    const applicationMetadata: ApplicationMetadata = options;

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(APPLICATION_METADATA, applicationMetadata, target);
  };
}

export interface ApplicationOptions {
  packages?: Package[];
  providers?: Provider[];
}

export type ApplicationMetadata = ApplicationOptions;
