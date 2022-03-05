import { Type } from '@caviajs/core';

import { Pipe } from '../types/pipe';
import { Request } from '../types/request';
import { Response } from '../types/response';

export const REQUEST_PARAM_METADATA = Symbol('REQUEST_PARAM_METADATA');

export function getRequestParamMetadata(target: object, propertyKey: string | symbol): RequestParamMetadata[] | undefined {
  return Reflect.getMetadata(REQUEST_PARAM_METADATA, target, propertyKey);
}

export function hasRequestParamMetadata(target: object, propertyKey: string | symbol): boolean {
  return Reflect.hasMetadata(REQUEST_PARAM_METADATA, target, propertyKey);
}

export function RequestParam(options: RequestParamOptions): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const value: RequestParamMetadata[] = [...(getRequestParamMetadata(target, propertyKey) || []), {
      factory: options.factory,
      index: parameterIndex,
    }];

    Reflect.defineMetadata(REQUEST_PARAM_METADATA, value, target, propertyKey);
  };
}

export function Body(options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Body(property?: string, options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Body(...args: any[]): ParameterDecorator {
  const options: Omit<RequestParamOptions, 'factory'> | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.body[property] : request.body;
    },
    pipes: options?.pipes,
  });
}

export function Cookies(options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Cookies(property?: string, options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Cookies(...args: any[]): ParameterDecorator {
  const options: Omit<RequestParamOptions, 'factory'> | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.cookies[property] : request.cookies;
    },
    pipes: options?.pipes,
  });
}

export function Headers(options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Headers(property?: string, options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Headers(...args: any[]): ParameterDecorator {
  const options: Omit<RequestParamOptions, 'factory'> | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.headers[property] : request.headers;
    },
    pipes: options?.pipes,
  });
}

export function Params(options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Params(property?: string, options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Params(...args: any[]): ParameterDecorator {
  const options: Omit<RequestParamOptions, 'factory'> | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.params[property] : request.params;
    },
    pipes: options?.pipes,
  });
}

export function Query(options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Query(property?: string, options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator;
export function Query(...args: any[]): ParameterDecorator {
  const options: Omit<RequestParamOptions, 'factory'> | undefined = args.find(it => typeof it === 'object');
  const property: string | undefined = args.find(it => typeof it === 'string');

  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.query[property] : request.query;
    },
    pipes: options?.pipes,
  });
}

export function Req(options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return request;
    },
    pipes: options?.pipes,
  });
}

export function Res(options?: Omit<RequestParamOptions, 'factory'>): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return response;
    },
    pipes: options?.pipes,
  });
}

export interface RequestParamFactory {
  (request: Request, response: Response): any;
}

export interface RequestParamMetadata extends RequestParamOptions {
  index: number;
}

export interface RequestParamOptions {
  factory: RequestParamFactory;
  pipes?: Array<Type<Pipe> | RequestParamPipeBinding>;
}

export interface RequestParamPipeBinding {
  args?: any[];
  pipe: Type<Pipe>;
}
