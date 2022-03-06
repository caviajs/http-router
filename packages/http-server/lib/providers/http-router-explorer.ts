import { getProviderName, Inject, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { Interceptor } from '../types/interceptor';
import { Pipe } from '../types/pipe';
import { HttpReflector } from '../http-reflector';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { HttpRouter, RouteInterceptor, RouteParam } from './http-router';
import { HTTP_GLOBAL_PREFIX, HttpGlobalPrefix } from './http-global-prefix';

@Injectable()
export class HttpRouterExplorer implements OnApplicationBoot {
  constructor(
    @Inject(HTTP_GLOBAL_PREFIX) private readonly httpGlobalPrefix: HttpGlobalPrefix,
    private readonly httpRouter: HttpRouter,
    private readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    for (const controllerInstance of await this.injector.filter(provider => HttpReflector.hasControllerMetadata(provider))) {
      const controllerConstructor: Type = controllerInstance.constructor;
      const controllerPrototype: any = Object.getPrototypeOf(controllerInstance);
      const controllerMethodNames: string[] = Object
        .getOwnPropertyNames(controllerPrototype)
        .filter(name => name !== 'constructor' && typeof controllerPrototype[name] === 'function')
        .filter(name => HttpReflector.hasRouteMetadata(controllerConstructor, name));

      for (const controllerMetadata of HttpReflector.getAllControllerMetadata(controllerConstructor)) {
        const controllerInterceptors: RouteInterceptor[] = await Promise.all(controllerMetadata.interceptors.map(async interceptor => {
          return { args: interceptor.args, interceptor: await this.resolveInterceptor(interceptor.interceptor) };
        }));

        for (const controllerMethodName of controllerMethodNames) {
          const allRouteParamMetadata = HttpReflector.getAllRouteParamMetadata(controllerConstructor, controllerMethodName);

          if (allRouteParamMetadata.length > new Set(allRouteParamMetadata.map(it => it.index)).size) {
            throw new Error(`Multiple parameter metadata per argument in '${ controllerConstructor.name }.${ controllerMethodName }'`);
          }

          for (const handlerMetadata of HttpReflector.getAllRouteMetadata(controllerConstructor, controllerMethodName)) {
            const routeHandler: Function = Object.getOwnPropertyDescriptor(controllerPrototype, controllerMethodName).value;
            const routeInterceptors: RouteInterceptor[] = await Promise.all(handlerMetadata.interceptors.map(async interceptor => {
              return { args: interceptor.args, interceptor: await this.resolveInterceptor(interceptor.interceptor) };
            }));
            const routeParams: RouteParam[] = await Promise.all(allRouteParamMetadata.map(async param => {
              return {
                factory: param.factory,
                metaType: undefined,
                pipes: await Promise.all(param.pipes.map(async p => ({ args: p.args, pipe: await this.resolvePipe(p.pipe) }))),
              };
            }));
            const method: Method = handlerMetadata.method;
            const path: Path = `/${ this.httpGlobalPrefix }/${ controllerMetadata.prefix }/${ handlerMetadata.path }`.replace(/\/+/g, '/');

            this.httpRouter.addRoute({
              controllerConstructor: controllerConstructor,
              controllerInstance: controllerInstance,
              controllerInterceptors: controllerInterceptors,
              method: method,
              path: path,
              routeHandler: routeHandler,
              routeInterceptors: routeInterceptors,
              routeParams: routeParams,
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
