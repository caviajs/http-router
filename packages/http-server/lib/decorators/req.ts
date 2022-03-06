import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Req(options?: ReqOptions): ParameterDecorator {
  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addParamMetadata(target, propertyKey, {
      factory: (request: Request, response: Response) => {
        return request;
      },
      index: parameterIndex,
      pipes: (options?.pipes || []).map(it => typeof it === 'function' ? { args: [], pipe: it } : { args: it.args || [], pipe: it.pipe }),
    });
  };
}

export interface ReqOptions {
  pipes?: (Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; })[];
}
