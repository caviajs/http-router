import { createRouteParamDecorator, RouteParamDecoratorFactory } from '../utils/create-route-param-decorator';

export const bodyRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string, context) => {
  const request = context.getRequest();

  return data ? request.body[data] : request.body;
};

export const Body = createRouteParamDecorator(bodyRouteParamDecoratorFactory);
