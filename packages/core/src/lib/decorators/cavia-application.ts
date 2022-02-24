import { Package } from '../types/package';
import { Provider } from '../types/provider';
import { Injectable } from './injectable';

export const CAVIA_APPLICATION_METADATA = Symbol('CAVIA_APPLICATION_METADATA');

export function getCaviaApplicationMetadata(target: object): CaviaApplicationMetadata | undefined {
  return Reflect.getMetadata(CAVIA_APPLICATION_METADATA, target);
}

export function hasCaviaApplicationMetadata(target: object): boolean {
  return Reflect.hasMetadata(CAVIA_APPLICATION_METADATA, target);
}

export function CaviaApplication(options?: CaviaApplicationOptions): ClassDecorator {
  return target => {
    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CAVIA_APPLICATION_METADATA, options, target);
  };
}

export interface CaviaApplicationOptions {
  packages?: Package[];
  providers?: Provider[];
}

export type CaviaApplicationMetadata = CaviaApplicationOptions;
