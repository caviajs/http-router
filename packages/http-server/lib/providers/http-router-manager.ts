import { getProviderName, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { CONTROLLER_PATH_METADATA, ControllerPathMetadata } from '../decorators/controller';
import { ROUTE_MAPPING_METHOD_METADATA, ROUTE_MAPPING_PATH_METADATA, RouteMappingMethodMetadata, RouteMappingPathMetadata } from '../decorators/route-mapping';
import { ROUTE_PARAM_METADATA } from '../decorators/route-param';
import { USE_INTERCEPTOR_METADATA } from '../decorators/use-interceptor';
import { USE_PIPE_METADATA } from '../decorators/use-pipe';
import { Interceptor } from '../types/interceptor';
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

    await Promise.all(controllerInstances.map(async (controllerInstance: any) => {
      const controllerConstructor: Type = controllerInstance.constructor;
      const controllerPathMetadata: ControllerPathMetadata = Reflect.getMetadata(CONTROLLER_PATH_METADATA, controllerConstructor);

      await Promise.all(
        Object
          .getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))
          .filter((name: string) => {
            return (
              Reflect.hasMetadata(ROUTE_MAPPING_METHOD_METADATA, controllerConstructor, name)
              &&
              Reflect.hasMetadata(ROUTE_MAPPING_PATH_METADATA, controllerConstructor, name)
            );
          })
          .map(async (routeHandlerName: string) => {
            const routeMappingMethodMetadata: RouteMappingMethodMetadata = Reflect.getMetadata(ROUTE_MAPPING_METHOD_METADATA, controllerConstructor, routeHandlerName);
            const routeMappingPathMetadata: RouteMappingPathMetadata = Reflect.getMetadata(ROUTE_MAPPING_PATH_METADATA, controllerConstructor, routeHandlerName);

            this.httpRouter.push({
              controllerConstructor: controllerConstructor,
              controllerInstance: controllerInstance,
              controllerInterceptors: await Promise.all(
                (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor) || [])
                  .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
                  .reverse(),
              ),
              method: routeMappingMethodMetadata,
              path: `/${ controllerPathMetadata }/${ routeMappingPathMetadata }`.replace(/\/+/g, '/').replace(/\/$/g, ''),
              routeHandler: Object.getOwnPropertyDescriptor(Object.getPrototypeOf(controllerInstance), routeHandlerName).value,
              routeHandlerInterceptors: await Promise.all(
                (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor, routeHandlerName) || [])
                  .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
                  .reverse(),
              ),
              routeHandlerParams: (Reflect.getMetadata(ROUTE_PARAM_METADATA, controllerConstructor, routeHandlerName) || [])
                .map(it => ({ data: it.data, factory: it.factory, index: it.index, })),
              routeHandlerPipes: await Promise.all(
                (Reflect.getMetadata(USE_PIPE_METADATA, controllerConstructor, routeHandlerName) || [])
                  .map(async it => ({ args: it.args, index: it.index, metaType: it.metaType, pipe: await this.resolvePipe(it.pipe) }))
              ),
            });
          }),
      );
    }));
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
