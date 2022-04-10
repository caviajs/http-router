import { Path } from '../types/path';
import { Method } from '../types/method';

export const ROUTE_MAPPING_METADATA: Symbol = Symbol('ROUTE_MAPPING_METADATA');

export function RouteMapping(method: Method, path: Path): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMappingMetadata: RouteMappingMetadata = {
      method: method,
      path: path,
    };

    Reflect.defineMetadata(ROUTE_MAPPING_METADATA, routeMappingMetadata, target.constructor, propertyKey);
  };
}

export interface RouteMappingMetadata {
  method: Method;
  path: Path;
}
