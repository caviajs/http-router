import { createRouteParamDecorator, RouteParamDecoratorFactory } from './route-param';

export const paramsRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.params[data] : request.params;
};

export const Params = createRouteParamDecorator(paramsRouteParamDecoratorFactory);
