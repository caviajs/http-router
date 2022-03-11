import { Type } from '@caviajs/core';
import { Pipe } from '../types/pipe';

export const USE_PIPE_METADATA: Symbol = Symbol('USE_PIPE_METADATA');

export function UsePipe(pipe: Type<Pipe>, args?: any[]): ParameterDecorator {
  return (target: Function, propertyKey: string, parameterIndex: number) => {
    const designParamTypesMetadata: any[] = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
    const usePipeMetadata: UsePipeMetadata = (Reflect.getMetadata(USE_PIPE_METADATA, target.constructor, propertyKey) || []);

    usePipeMetadata.push({
      args: args || [],
      index: parameterIndex,
      metaType: designParamTypesMetadata[parameterIndex],
      pipe: pipe,
    });

    Reflect.defineMetadata(USE_PIPE_METADATA, usePipeMetadata, target.constructor, propertyKey);
  };
}

export type UsePipeMetadata = { args: any[]; index: number; metaType: any; pipe: Type<Pipe>; }[];
