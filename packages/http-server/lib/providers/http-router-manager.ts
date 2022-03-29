import { getProviderName, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { CONTROLLER_PATH_METADATA, ControllerPathMetadata } from '../decorators/controller';
import { ROUTE_MAPPING_METHOD_METADATA, ROUTE_MAPPING_PATH_METADATA, RouteMappingMethodMetadata, RouteMappingPathMetadata } from '../decorators/route-mapping';
import { RouteParamMetadata, ROUTE_PARAM_METADATA } from '../decorators/route-param';
import { UseInterceptorMetadata, USE_INTERCEPTOR_METADATA } from '../decorators/use-interceptor';
import { UsePipeMetadata, USE_PIPE_METADATA } from '../decorators/use-pipe';
import { Interceptor } from '../types/interceptor';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { Pipe } from '../types/pipe';
import { HttpRouter } from './http-router';

@Injectable()
export class HttpRouterManager implements OnApplicationBoot {
  constructor(
    private readonly httpRouter: HttpRouter,
    private readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const controllerInstances: any[] = await this
      .injector
      .filter(provider => Reflect.hasMetadata(CONTROLLER_PATH_METADATA, provider));

    for (const controllerInstance of controllerInstances) {
      const controllerConstructor: Type = controllerInstance.constructor;
      const controllerPrototype: any = Object.getPrototypeOf(controllerInstance);
      const controllerMethodNames: string[] = Object
        .getOwnPropertyNames(controllerPrototype)
        .filter((name: string) => {
          return (
            name !== 'constructor'
            &&
            typeof controllerPrototype[name] === 'function'
            &&
            Reflect.hasMetadata(ROUTE_MAPPING_METHOD_METADATA, controllerConstructor, name)
            &&
            Reflect.hasMetadata(ROUTE_MAPPING_PATH_METADATA, controllerConstructor, name)
          );
        });
      const controllerPathMetadata: ControllerPathMetadata = Reflect.getMetadata(CONTROLLER_PATH_METADATA, controllerConstructor);
      const controllerInterceptorMetadata: UseInterceptorMetadata = Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor) || [];

      for (const controllerMethodName of controllerMethodNames) {
        const routeMappingMethodMetadata: RouteMappingMethodMetadata = Reflect.getMetadata(ROUTE_MAPPING_METHOD_METADATA, controllerConstructor, controllerMethodName);
        const routeMappingPathMetadata: RouteMappingPathMetadata = Reflect.getMetadata(ROUTE_MAPPING_PATH_METADATA, controllerConstructor, controllerMethodName);
        const routeInterceptorMetadata: UseInterceptorMetadata = Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor, controllerMethodName) || [];
        const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, controllerConstructor, controllerMethodName) || [];
        const usePipeMetadata: UsePipeMetadata = Reflect.getMetadata(USE_PIPE_METADATA, controllerConstructor, controllerMethodName) || [];

        const routeHandler: Function = Object.getOwnPropertyDescriptor(controllerPrototype, controllerMethodName).value;
        const method: Method = routeMappingMethodMetadata;
        const path: Path = `/${ controllerPathMetadata }/${ routeMappingPathMetadata }`.replace(/\/+/g, '/').replace(/\/$/g, '');

        this.httpRouter.add({
          controllerConstructor: controllerConstructor,
          controllerInstance: controllerInstance,
          controllerInterceptors: await Promise.all(controllerInterceptorMetadata.map(async it => ({
            args: it.args,
            interceptor: await this.resolveInterceptor(it.interceptor),
          }))),
          method: method,
          path: path,
          routeHandler: routeHandler,
          routeHandlerInterceptors: await Promise.all(routeInterceptorMetadata.map(async it => ({
            args: it.args,
            interceptor: await this.resolveInterceptor(it.interceptor),
          }))),
          routeHandlerParams: routeParamMetadata.map(it => ({
            data: it.data,
            factory: it.factory,
            index: it.index,
          })),
          routeHandlerPipes: await Promise.all(usePipeMetadata.map(async it => ({
            args: it.args,
            index: it.index,
            metaType: it.metaType,
            pipe: await this.resolvePipe(it.pipe),
          }))),
        });
      }
    }
  }

  protected async resolveInterceptor(interceptor: Type<Interceptor>): Promise<Interceptor> {
    const instance = await this.injector.find(interceptor);

    if (!instance) {
      throw new Error(`Cavia can't resolve interceptor '${ getProviderName(interceptor) }'`);
    }

    return instance;
  }

  protected async resolvePipe(pipe: Type<Pipe>): Promise<Pipe> {
    const instance = await this.injector.find(pipe);

    if (!instance) {
      throw new Error(`Cavia can't resolve pipe '${ getProviderName(pipe) }'`);
    }

    return instance;
  }
}
