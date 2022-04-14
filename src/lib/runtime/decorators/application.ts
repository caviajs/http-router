import { Package } from '../types/package';
import { Provider } from '../../ioc/types/provider';
import { Injectable } from '../../ioc/decorators/injectable';

export const APPLICATION_METADATA = Symbol('APPLICATION_METADATA');

export function Application(options?: ApplicationOptions): ClassDecorator {
  return (target: Function) => {
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
