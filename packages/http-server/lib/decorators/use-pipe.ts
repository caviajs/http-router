import { Type } from '@caviajs/core';
import { Pipe } from '../types/pipe';

export const USE_PIPE_METADATA: Symbol = Symbol('USE_PIPE_METADATA');

export function UsePipe(pipe: Type<Pipe>, args?: any[]): ParameterDecorator {
  return (target: Function, propertyKey: string, parameterIndex: number) => {
    const usePipeMetadata: UsePipeMetadata = (Reflect.getMetadata(USE_PIPE_METADATA, target.constructor, propertyKey) || []).push({
      args: args || [],
      index: parameterIndex,
      pipe: pipe,
    });

    Reflect.defineMetadata(USE_PIPE_METADATA, usePipeMetadata, target.constructor, propertyKey);
  };
}

export type UsePipeMetadata = { args: any[]; index: number; pipe: Type<Pipe>; }[];
