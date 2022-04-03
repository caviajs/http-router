import { Request } from '../types/request';
import { Response } from '../types/response';

export const ROUTE_PARAM_METADATA: Symbol = Symbol('ROUTE_PARAM_METADATA');

export function RouteParam(factory: RouteParamFactory): ParameterDecorator {
  return (target: Function, propertyKey: string, parameterIndex: number) => {
    const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, target.constructor, propertyKey) || new Map();

    routeParamMetadata.set(parameterIndex, factory);

    Reflect.defineMetadata(ROUTE_PARAM_METADATA, routeParamMetadata, target.constructor, propertyKey);
  };
}

export interface RouteParamFactory {
  (request: Request, response: Response): any;
}

export type RouteParamMetadata = Map<number, RouteParamFactory>;
