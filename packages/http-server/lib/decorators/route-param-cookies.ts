import { createRouteParamDecorator, RouteParamDecoratorFactory } from './route-param';

export const cookiesRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.cookies[data] : request.cookies;
};

export const Cookies = createRouteParamDecorator(cookiesRouteParamDecoratorFactory);
