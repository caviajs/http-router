import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Cookies(options?: CookiesOptions): ParameterDecorator;
export function Cookies(property?: string, options?: CookiesOptions): ParameterDecorator;
export function Cookies(...args: any[]): ParameterDecorator {
  const options: CookiesOptions | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addParamMetadata(target, propertyKey, {
      factory: (request: Request, response: Response) => {
        return property ? request.cookies[property] : request.cookies;
      },
      index: parameterIndex,
      pipes: (options?.pipes || []).map(it => typeof it === 'function' ? { args: [], pipe: it } : { args: it.args || [], pipe: it.pipe }),
    });
  };
}

export interface CookiesOptions {
  pipes?: (Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; })[];
}
