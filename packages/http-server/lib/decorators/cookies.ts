import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Cookies(...pipes: CookiesPipe[]): ParameterDecorator;
export function Cookies(property?: string, ...pipes: CookiesPipe[]): ParameterDecorator;
export function Cookies(...args: any[]): ParameterDecorator {
  const pipes: CookiesPipe[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addRouteParamMetadata(target.constructor, propertyKey, {
      factory: (request: Request, response: Response) => {
        return property ? request.cookies[property] : request.cookies;
      },
      index: parameterIndex,
      pipes: pipes.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        pipe: typeof it === 'function' ? it : it.pipe,
      })),
    });
  };
}

export type CookiesPipe = Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; };
