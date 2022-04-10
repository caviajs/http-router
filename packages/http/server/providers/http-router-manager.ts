import { getProviderName, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { CONTROLLER_METADATA, ControllerMetadata } from '../decorators/controller';
import { ROUTE_MAPPING_METADATA, RouteMappingMetadata } from '../decorators/route-mapping';
import { USE_INTERCEPTOR_METADATA } from '../decorators/use-interceptor';
import { Interceptor } from '../types/interceptor';
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
      .filter(provider => Reflect.hasMetadata(CONTROLLER_METADATA, provider));

    await Promise.all(controllerInstances.map(async (controllerInstance: any) => {
      const controllerConstructor: Type = controllerInstance.constructor;
      const controllerMetadata: ControllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA, controllerConstructor);

      await Promise.all(
        Object
          .getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))
          .filter((name: string) => {
            return Reflect.hasMetadata(ROUTE_MAPPING_METADATA, controllerConstructor, name);
          })
          .map(async (routeHandlerName: string) => {
            const routeMappingMetadata: RouteMappingMetadata = Reflect.getMetadata(ROUTE_MAPPING_METADATA, controllerConstructor, routeHandlerName);

            this.httpRouter.push({
              controllerConstructor: controllerConstructor,
              controllerInstance: controllerInstance,
              controllerInterceptors: await Promise.all(
                (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor) || [])
                  .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
                  .reverse(),
              ),
              method: routeMappingMetadata.method,
              path: `/${ controllerMetadata.path }/${ routeMappingMetadata.path }`.replace(/\/+/g, '/').replace(/\/$/g, ''),
              routeHandler: Object.getOwnPropertyDescriptor(Object.getPrototypeOf(controllerInstance), routeHandlerName).value,
              routeHandlerInterceptors: await Promise.all(
                (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor, routeHandlerName) || [])
                  .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
                  .reverse(),
              ),
              schema: {
                body: '',
                cookies: '',
                headers: '',
                params: '',
                query: '',
              },
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
}
