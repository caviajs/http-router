import { createRouteParamDecorator, RouteParamDecoratorFactory } from './route-param';

export const queryRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.query[data] : request.query;
};

export const Query = createRouteParamDecorator(queryRouteParamDecoratorFactory);
