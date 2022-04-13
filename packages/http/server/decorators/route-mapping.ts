import { Schema } from '@caviajs/core';
import { Path } from '../types/path';
import { Method } from '../types/method';

export const ROUTE_MAPPING_METADATA: Symbol = Symbol('ROUTE_MAPPING_METADATA');

export function RouteMapping(method: Method, path: Path, schema?: RouteMappingSchema): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMappingMetadata: RouteMappingMetadata = {
      method: method,
      path: path,
      schema: schema,
    };

    Reflect.defineMetadata(ROUTE_MAPPING_METADATA, routeMappingMetadata, target.constructor, propertyKey);
  };
}

export interface RouteMappingMetadata {
  method: Method;
  path: Path;
  schema?: RouteMappingSchema;
}

export interface RouteMappingSchema {
  request?: {
    body?: Schema;
    cookies?: Schema;
    headers?: Schema;
    params?: Schema;
    query?: Schema;
  };
  responses?: {
    // responseBody?: Schema;
    // responseHeaders?: Schema;
  };
}
