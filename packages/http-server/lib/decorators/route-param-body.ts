import { createRouteParamDecorator, RouteParamDecoratorFactory } from './route-param';

export const bodyRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.body[data] : request.body;
};

export const Body = createRouteParamDecorator(bodyRouteParamDecoratorFactory);
