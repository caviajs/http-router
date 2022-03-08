import { createRouteParamDecorator, RouteParamDecoratorFactory } from '../utils/create-route-param-decorator';

export const paramsRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string, context) => {
  const request = context.getRequest();

  return data ? request.params[data] : request.params;
};

export const Params = createRouteParamDecorator(paramsRouteParamDecoratorFactory);
