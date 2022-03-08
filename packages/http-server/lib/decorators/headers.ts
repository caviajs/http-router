import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Headers(...pipes: HeadersPipe[]): ParameterDecorator;
export function Headers(property?: string, ...pipes: HeadersPipe[]): ParameterDecorator;
export function Headers(...args: any[]): ParameterDecorator {
  const pipes: HeadersPipe[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addRouteParamMetadata(target.constructor, propertyKey, {
      factory: (request: Request, response: Response) => {
        return property ? request.headers[property] : request.headers;
      },
      index: parameterIndex,
      pipes: pipes.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        pipe: typeof it === 'function' ? it : it.pipe,
      })),
    });
  };
}

export type HeadersPipe = Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; };
