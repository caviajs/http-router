import { Path } from '../types/path';
import { Method } from '../types/method';

const DEFAULT_PATH: string = '/';

export const ROUTE_MAPPING_METHOD_METADATA: Symbol = Symbol('ROUTE_MAPPING_METHOD_METADATA');
export const ROUTE_MAPPING_PATH_METADATA: Symbol = Symbol('ROUTE_MAPPING_PATH_METADATA');

export function RouteMapping(method: Method, path: Path | Path[]): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMappingMethodMetadata: RouteMappingMethodMetadata = method;
    const routeMappingPathMetadata: RouteMappingPathMetadata = Array.isArray(path) ? path : [path];

    Reflect.defineMetadata(ROUTE_MAPPING_METHOD_METADATA, routeMappingMethodMetadata, target.constructor, propertyKey);
    Reflect.defineMetadata(ROUTE_MAPPING_PATH_METADATA, routeMappingPathMetadata, target.constructor, propertyKey);
  };
}

export function Delete(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('DELETE', path || DEFAULT_PATH);
}

export function Get(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('GET', path || DEFAULT_PATH);
}

export function Head(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('HEAD', path || DEFAULT_PATH);
}

export function Options(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('OPTIONS', path || DEFAULT_PATH);
}

export function Patch(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('PATCH', path || DEFAULT_PATH);
}

export function Post(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('POST', path || DEFAULT_PATH);
}

export function Put(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('PUT', path || DEFAULT_PATH);
}

export type RouteMappingMethodMetadata = Method;

export type RouteMappingPathMetadata = Path[];
