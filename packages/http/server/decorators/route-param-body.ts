import { RouteParam } from './route-param';

export const ROUTE_PARAM_BODY_METADATA: Symbol = Symbol('ROUTE_PARAM_BODY_METADATA');

export function Body(schema?: any): ParameterDecorator {
  return (target: Function, propertyKey: string, parameterIndex: number) => {
    RouteParam(request => request.body)(target, propertyKey, parameterIndex);

    const routeParamBodyMetadata: RouteParamBodyMetadata = {
      schema: schema,
    };

    Reflect.defineMetadata(ROUTE_PARAM_BODY_METADATA, routeParamBodyMetadata, target, propertyKey);
  };
}

export interface RouteParamBodyMetadata {
  schema?: any;
}
