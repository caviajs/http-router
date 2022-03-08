import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Params(...pipes: ParamsPipe[]): ParameterDecorator;
export function Params(property?: string, ...pipes: ParamsPipe[]): ParameterDecorator;
export function Params(...args: any[]): ParameterDecorator {
  const pipes: ParamsPipe[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addRouteParamMetadata(target.constructor, propertyKey, {
      factory: (request: Request, response: Response) => {
        return property ? request.params[property] : request.params;
      },
      index: parameterIndex,
      pipes: pipes.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        pipe: typeof it === 'function' ? it : it.pipe,
      })),
    });
  };
}

export type ParamsPipe = Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; };
