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

export function Body(property?: string): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.body[property] : request.body;
    },
  });
}

export function Cookies(property?: string): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.cookies[property] : request.cookies;
    },
  });
}

export function Headers(property?: string): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.headers[property] : request.headers;
    },
  });
}

export function Params(property?: string): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.params[property] : request.params;
    },
  });
}

export function Query(property?: string): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return property ? request.query[property] : request.query;
    },
  });
}

export function Req(): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return request;
    },
  });
}

export function Res(): ParameterDecorator {
  return RequestParam({
    factory: (request: Request, response: Response) => {
      return response;
    },
  });
}

export interface RequestParamFactory {
  (request: Request, response: Response): any;
}

export interface RequestParamOptions {
  factory: RequestParamFactory;
}

export interface RequestParamMetadata extends RequestParamOptions {
  index: number;
}
