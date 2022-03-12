import { ExecutionContext } from '../types/execution-context';

export const ROUTE_PARAM_METADATA: Symbol = Symbol('ROUTE_PARAM_METADATA');

export function createRouteParamDecorator(factory: RouteParamDecoratorFactory): RouteParamDecorator {
  return (data: unknown): ParameterDecorator => {
    return (target: Function, propertyKey: string, parameterIndex: number) => {
      const routeParamMetadata: RouteParamMetadata = (Reflect.getMetadata(ROUTE_PARAM_METADATA, target.constructor, propertyKey) || []);

      routeParamMetadata.push({
        data: data,
        factory: factory,
        index: parameterIndex,
      });

      Reflect.defineMetadata(ROUTE_PARAM_METADATA, routeParamMetadata, target.constructor, propertyKey);
    };
  };
}

export interface RouteParamDecorator {
  (data?: unknown): ParameterDecorator;
}

export interface RouteParamDecoratorFactory {
  (data: unknown, context: ExecutionContext): any;
}

export type RouteParamMetadata = { data: unknown; factory: RouteParamDecoratorFactory; index: number; }[];
