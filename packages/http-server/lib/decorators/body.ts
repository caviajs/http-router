import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { Pipe } from '../types/pipe';
import { HttpReflector } from '../http-reflector';

export function Body(options?: BodyOptions): ParameterDecorator;
export function Body(property?: string, options?: BodyOptions): ParameterDecorator;
export function Body(...args: any[]): ParameterDecorator {
  const options: BodyOptions | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addParamMetadata(target, propertyKey, {
      factory: (request: Request, response: Response) => {
        return property ? request.body[property] : request.body;
      },
      index: parameterIndex,
      pipes: (options?.pipes || []).map(it => typeof it === 'function' ? { args: [], pipe: it } : { args: it.args || [], pipe: it.pipe }),
    });
  };
}

export interface BodyOptions {
  pipes?: (Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; })[];
}
