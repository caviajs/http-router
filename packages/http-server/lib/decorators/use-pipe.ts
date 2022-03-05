import { Type } from '@caviajs/core';

import { Pipe } from '../types/pipe';

export const USE_PIPE_METADATA = Symbol('USE_PIPE_METADATA');

export function getUsePipeMetadata(target: object, propertyKey: string | symbol): UsePipeMetadata[] | undefined {
  return Reflect.getMetadata(USE_PIPE_METADATA, target, propertyKey);
}

export function hasUsePipeMetadata(target: object, propertyKey: string | symbol): boolean {
  return Reflect.hasMetadata(USE_PIPE_METADATA, target, propertyKey);
}

export function UsePipe(pipe: Type<Pipe>, ...args: any[]): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const value: UsePipeMetadata[] = [...(getUsePipeMetadata(target, propertyKey) || []), {
      args: args,
      pipe: pipe,
      index: parameterIndex,
    }];

    Reflect.defineMetadata(USE_PIPE_METADATA, value, target, propertyKey);
  };
}

export interface UsePipeMetadata {
  args: any[];
  pipe: Type<Pipe>;
  index: number;
}
