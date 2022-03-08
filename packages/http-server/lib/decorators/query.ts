import { createRouteParamDecorator, RouteParamDecoratorFactory } from '../utils/create-route-param-decorator';

export const queryRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string, context) => {
  const request = context.getRequest();

  return data ? request.query[data] : request.query;
};

export const Query = createRouteParamDecorator(queryRouteParamDecoratorFactory);
