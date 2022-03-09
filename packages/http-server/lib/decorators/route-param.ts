import { ExecutionContext } from '../types/execution-context';

export const ROUTE_PARAM_METADATA: Symbol = Symbol('ROUTE_PARAM_METADATA');

export const bodyRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.body[data] : request.body;
};

export const cookiesRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.cookies[data] : request.cookies;
};

export const headersRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.headers[data] : request.headers;
};

export const paramsRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.params[data] : request.params;
};

export const queryRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.query[data] : request.query;
};

export const reqRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  return context.getRequest();
};

export const resRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  return context.getResponse();
};

export const Body = createRouteParamDecorator(bodyRouteParamDecoratorFactory);

export const Cookies = createRouteParamDecorator(cookiesRouteParamDecoratorFactory);

export const Headers = createRouteParamDecorator(headersRouteParamDecoratorFactory);

export const Params = createRouteParamDecorator(paramsRouteParamDecoratorFactory);

export const Query = createRouteParamDecorator(queryRouteParamDecoratorFactory);

export const Req = createRouteParamDecorator(reqRouteParamDecoratorFactory);

export const Res = createRouteParamDecorator(resRouteParamDecoratorFactory);

export function createRouteParamDecorator(factory: RouteParamDecoratorFactory): RouteParamDecorator {
  return (data: unknown): ParameterDecorator => {
    return (target: Function, propertyKey: string, parameterIndex: number) => {
      const routeParamMetadata: RouteParamMetadata = (Reflect.getMetadata(ROUTE_PARAM_METADATA, target.constructor, propertyKey) || []).push({
        factory: (context: ExecutionContext) => {
          return factory(data, context);
        },
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

export type RouteParamMetadata = { factory: (context: ExecutionContext) => any; index: number; }[];
