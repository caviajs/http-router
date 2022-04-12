import { Schema } from '@caviajs/core';
import { Path } from '../types/path';
import { Method } from '../types/method';

export const ROUTE_MAPPING_METADATA: Symbol = Symbol('ROUTE_MAPPING_METADATA');

export function RouteMapping(method: Method, path: Path, options?: RouteMappingOptions): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMappingMetadata: RouteMappingMetadata = {
      method: method,
      path: path,
      schema: options?.schema,
    };

    Reflect.defineMetadata(ROUTE_MAPPING_METADATA, routeMappingMetadata, target.constructor, propertyKey);
  };
}

export interface RouteMappingMetadata extends RouteMappingOptions {
  method: Method;
  path: Path;
}

export interface RouteMappingOptions {
  schema?: {
    requestBody?: Schema;
    requestCookies?: Schema;
    requestHeaders?: Schema;
    requestParams?: Schema;
    requestQuery?: Schema;
    responseBody?: Schema;
    responseHeaders?: Schema;
  };
}
