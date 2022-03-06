import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Res(options?: ResOptions): ParameterDecorator {
  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addParamMetadata(target, propertyKey, {
      factory: (request: Request, response: Response) => {
        return response;
      },
      index: parameterIndex,
      pipes: options?.pipes?.map(it => typeof it === 'function' ? { pipe: it } : it) || [],
    });
  };
}

export interface ResOptions {
  pipes?: (Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; })[];
}
