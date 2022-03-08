import { createRouteParamDecorator, RouteParamDecoratorFactory } from '../utils/create-route-param-decorator';

export const reqRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string, context) => {
  return context.getRequest();
};

export const Req = createRouteParamDecorator(reqRouteParamDecoratorFactory);
