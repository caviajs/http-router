import { createRouteParamDecorator, RouteParamDecoratorFactory } from '../utils/create-route-param-decorator';

export const cookiesRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string, context) => {
  const request = context.getRequest();

  return data ? request.cookies[data] : request.cookies;
};

export const Cookies = createRouteParamDecorator(cookiesRouteParamDecoratorFactory);
