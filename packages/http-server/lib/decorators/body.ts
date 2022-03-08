import { Type } from '@caviajs/core';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { Pipe } from '../types/pipe';
import { HttpReflector } from '../http-reflector';

export function Body(...pipes: BodyPipe[]): ParameterDecorator;
export function Body(property?: string, ...pipes: BodyPipe[]): ParameterDecorator;
export function Body(...args: any[]): ParameterDecorator {
  const pipes: BodyPipe[] = args.filter(it => typeof it === 'function' || typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addRouteParamMetadata(target.constructor, propertyKey, {
      factory: (request: Request, response: Response) => {
        return property ? request.body[property] : request.body;
      },
      index: parameterIndex,
      pipes: pipes.map(it => ({
        args: typeof it === 'function' ? [] : (it.args || []),
        pipe: typeof it === 'function' ? it : it.pipe,
      })),
    });
  };
}

export type BodyPipe = Type<Pipe> | { args?: any[]; pipe: Type<Pipe>; };
