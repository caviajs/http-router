import { getProviderName, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { CONTROLLER_METADATA, ControllerMetadata } from '../decorators/controller';
import { ROUTE_MAPPING_METADATA, RouteMappingMetadata } from '../decorators/route-mapping';
import { USE_INTERCEPTOR_METADATA } from '../decorators/use-interceptor';
import { Interceptor } from '../types/interceptor';
import { HttpRouter } from './http-router';

@Injectable()
export class HttpRouterManager implements OnApplicationBoot {
  constructor(
    protected readonly httpRouter: HttpRouter,
    protected readonly injector: Injector,
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
              controller: controllerInstance,
              handler: Object.getOwnPropertyDescriptor(Object.getPrototypeOf(controllerInstance), routeHandlerName).value,
              interceptors: [
                ...await Promise.all(
                  (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor) || [])
                    .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
                    .reverse(),
                ),
                ...await Promise.all(
                  (Reflect.getMetadata(USE_INTERCEPTOR_METADATA, controllerConstructor, routeHandlerName) || [])
                    .map(async it => ({ args: it.args, interceptor: await this.resolveInterceptor(it.interceptor) }))
                    .reverse(),
                ),
              ],
              method: routeMappingMetadata.method,
              path: `/${ controllerMetadata.path }/${ routeMappingMetadata.path }`.replace(/\/+/g, '/').replace(/\/$/g, ''),
              requestBodySchema: routeMappingMetadata.schema?.requestBody,
              requestCookiesSchema: routeMappingMetadata.schema?.requestCookies,
              requestHeadersSchema: routeMappingMetadata.schema?.requestHeaders,
              requestParamsSchema: routeMappingMetadata.schema?.requestParams,
              requestQuerySchema: routeMappingMetadata.schema?.requestQuery,
              responseBodySchema: routeMappingMetadata.schema?.responseBody,
              responseHeadersSchema: routeMappingMetadata.schema?.responseHeaders,
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
