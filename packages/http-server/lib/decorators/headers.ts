import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';
import { Pipe } from '../types/pipe';

export function Headers(options?: HeadersOptions): ParameterDecorator;
export function Headers(property?: string, options?: HeadersOptions): ParameterDecorator;
export function Headers(...args: any[]): ParameterDecorator {
  const options: HeadersOptions | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addParamMetadata(target, propertyKey, {
      factory: (request: Request, response: Response) => {
        return property ? request.headers[property] : request.headers;
      },
      index: parameterIndex,
      pipes: (options?.pipes || []).map(it => typeof it === 'function' ? { args: [], pipe: it } : { args: it.args || [], pipe: it.pipe }),
    });
  };
}

export interface HeadersOptions {
  pipes?: (Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; })[];
}
