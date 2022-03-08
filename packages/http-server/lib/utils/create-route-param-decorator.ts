import { ExecutionContext, HttpReflector, Pipe } from '@caviajs/http-server';

function isPipe(pipe: any): pipe is Pipe {
  return pipe && typeof pipe === 'function' && typeof pipe.prototype?.transform === 'function';
}

export function createRouteParamDecorator(factory: RouteParamDecoratorFactory): RouteParamDecorator {
  return (...args: any[]): ParameterDecorator => {
    return (target, propertyKey: string, parameterIndex) => {
      const data: unknown | undefined = isPipe(args[0]) ? undefined : args[0];

      HttpReflector.addRouteParamMetadata(target.constructor, propertyKey, {
        factory: (context: ExecutionContext) => factory(data, context),
        index: parameterIndex,
      });
    };
  };
}

export interface RouteParamDecorator {
  (data?: unknown): ParameterDecorator;
}

export interface RouteParamDecoratorFactory {
  (data: unknown, ctx: ExecutionContext): any;
}
