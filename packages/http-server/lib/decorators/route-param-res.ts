import { createRouteParamDecorator, RouteParamDecoratorFactory } from './route-param';

export const resRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string | undefined, context) => {
  return context.getResponse();
};

export const Res = createRouteParamDecorator(resRouteParamDecoratorFactory);
