import { Type } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function UsePipe(pipe: Type<Pipe>, args?: any[]): ParameterDecorator {
  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addRouteParamPipeMetadata(target.constructor, propertyKey, {
      args: args || [],
      index: parameterIndex,
      pipe: pipe,
    });
  };
}
