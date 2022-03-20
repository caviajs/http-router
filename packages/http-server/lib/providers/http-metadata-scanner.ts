import { getProviderName, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { Interceptor } from '../types/interceptor';
import { Pipe } from '../types/pipe';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { HttpRouter } from './http-router';
import { CONTROLLER_PATH_METADATA, ControllerPathMetadata } from '../decorators/controller';
import {
  ROUTE_MAPPING_METHOD_METADATA,
  ROUTE_MAPPING_PATH_METADATA,
  RouteMappingMethodMetadata,
  RouteMappingPathMetadata,
} from '../decorators/route-mapping';

@Injectable()
export class HttpMetadataScanner implements OnApplicationBoot {
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
        .filter(name => {
          return name !== 'constructor' && typeof controllerPrototype[name] === 'function';
        })
        .filter(name => {
          return (
            Reflect.hasMetadata(ROUTE_MAPPING_METHOD_METADATA, controllerConstructor, name)
            ||
            Reflect.hasMetadata(ROUTE_MAPPING_PATH_METADATA, controllerConstructor, name)
          );
        });
      const controllerPathMetadata: ControllerPathMetadata = Reflect.getMetadata(CONTROLLER_PATH_METADATA, controllerConstructor) || [];

      for (const controllerPath of controllerPathMetadata) {
        for (const controllerMethodName of controllerMethodNames) {
          const routeMappingMethodMetadata: RouteMappingMethodMetadata = Reflect.getMetadata(ROUTE_MAPPING_METHOD_METADATA, controllerConstructor, controllerMethodName);
          const routeMappingPathMetadata: RouteMappingPathMetadata = Reflect.getMetadata(ROUTE_MAPPING_PATH_METADATA, controllerConstructor, controllerMethodName);

          for (const routeMappingPath of routeMappingPathMetadata) {
            const routeHandler: Function = Object.getOwnPropertyDescriptor(controllerPrototype, controllerMethodName).value;
            const method: Method = routeMappingMethodMetadata;
            const path: Path = `/${ controllerPath }/${ routeMappingPath }`.replace(/\/+/g, '/');

            console.log({
              controllerConstructor: controllerConstructor,
              controllerInstance: controllerInstance,
              controllerInterceptors: [],
              method: method,
              path: path,
              routeHandler: routeHandler,
              routeInterceptors: [],
              routeParams: [],
            });
          }
        }
      }
    }
  }

  protected async resolveInterceptor(interceptor: Type<Interceptor>): Promise<Interceptor> {
    const interceptorInstance = await this.injector.find(interceptor);

    if (!interceptorInstance) {
      throw new Error(`Cavia can't resolve interceptor '${ getProviderName(interceptor) }'`);
    }

    return interceptorInstance;
  }

  protected async resolvePipe(pipe: Type<Pipe>): Promise<Pipe> {
    const pipeInstance = await this.injector.find(pipe);

    if (!pipeInstance) {
      throw new Error(`Cavia can't resolve pipe '${ getProviderName(pipe) }'`);
    }

    return pipeInstance;
  }
}
