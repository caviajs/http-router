import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Params(options?: ParamsOptions): ParameterDecorator;
export function Params(property?: string, options?: ParamsOptions): ParameterDecorator;
export function Params(...args: any[]): ParameterDecorator {
  const options: ParamsOptions | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addRouteParamMetadata(target.constructor, propertyKey, {
      factory: (request: Request, response: Response) => {
        return property ? request.params[property] : request.params;
      },
      index: parameterIndex,
      pipes: (options?.pipes || []).map(it => typeof it === 'function' ? { args: [], pipe: it } : { args: it.args || [], pipe: it.pipe }),
    });
  };
}

export interface ParamsOptions {
  pipes?: (Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; })[];
}
