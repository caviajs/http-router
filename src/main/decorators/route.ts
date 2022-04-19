import { Path } from '../types/path';
import { Method } from '../types/method';
import { Schema } from '../types/schema';

export const ROUTE_METADATA: Symbol = Symbol('ROUTE_METADATA');

export function Route(method: Method, path: Path, schema?: RouteSchema): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMetadata: RouteMetadata = {
      method: method,
      path: path,
      schema: schema,
    };

    Reflect.defineMetadata(ROUTE_METADATA, routeMetadata, target.constructor, propertyKey);
  };
}

export interface RouteMetadata {
  method: Method;
  path: Path;
  schema?: RouteSchema;
}

export interface RouteSchema {
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
