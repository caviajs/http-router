import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Res(options?: ResOptions): ParameterDecorator {
  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addParamMetadata(target.constructor, propertyKey, {
      factory: (request: Request, response: Response) => {
        return response;
      },
      index: parameterIndex,
      pipes: (options?.pipes || []).map(it => typeof it === 'function' ? { args: [], pipe: it } : { args: it.args || [], pipe: it.pipe }),
    });
  };
}

export interface ResOptions {
  pipes?: (Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; })[];
}
