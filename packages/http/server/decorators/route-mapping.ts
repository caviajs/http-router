import { Path } from '../types/path';
import { Method } from '../types/method';

export const ROUTE_MAPPING_METHOD_METADATA: Symbol = Symbol('ROUTE_MAPPING_METHOD_METADATA');
export const ROUTE_MAPPING_PATH_METADATA: Symbol = Symbol('ROUTE_MAPPING_PATH_METADATA');

export function RouteMapping(method: Method, path: Path): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMappingMethodMetadata: RouteMappingMethodMetadata = method;
    const routeMappingPathMetadata: RouteMappingPathMetadata = path;

    Reflect.defineMetadata(ROUTE_MAPPING_METHOD_METADATA, routeMappingMethodMetadata, target.constructor, propertyKey);
    Reflect.defineMetadata(ROUTE_MAPPING_PATH_METADATA, routeMappingPathMetadata, target.constructor, propertyKey);
  };
}

export type RouteMappingMethodMetadata = Method;

export type RouteMappingPathMetadata = Path;
