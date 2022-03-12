import { createRouteParamDecorator, RouteParamDecoratorFactory } from './route-param';

export const headersRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  const request = context.getRequest();
  return data ? request.headers[data] : request.headers;
};

export const Headers = createRouteParamDecorator(headersRouteParamDecoratorFactory);
