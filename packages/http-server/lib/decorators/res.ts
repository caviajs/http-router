import { createRouteParamDecorator, RouteParamDecoratorFactory } from '../utils/create-route-param-decorator';

export const resRouteParamDecoratorFactory: RouteParamDecoratorFactory = (data: string, context) => {
  return context.getResponse();
};

export const Res = createRouteParamDecorator(resRouteParamDecoratorFactory);
