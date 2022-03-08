import { createRouteParamDecorator, RouteParamDecoratorFactory } from '../utils/create-route-param-decorator';

export const headersRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string, context) => {
  const request = context.getRequest();

  return data ? request.headers[data] : request.headers;
};

export const Headers = createRouteParamDecorator(headersRouteParamDecoratorFactory);
