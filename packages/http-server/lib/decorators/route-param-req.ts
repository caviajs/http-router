import { createRouteParamDecorator, RouteParamDecoratorFactory } from './route-param';

export const reqRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  return context.getRequest();
};

export const Req = createRouteParamDecorator(reqRouteParamDecoratorFactory);
