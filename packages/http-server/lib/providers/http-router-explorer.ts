import { getProviderName, getProviderToken, Inject, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { Logger } from '@caviajs/logger';
import http from 'http';

import { LOGGER_CONTEXT } from '../http-constants';
import { Interceptor } from '../types/interceptor';
import { HTTP_GLOBAL_INTERCEPTORS, HttpGlobalInterceptors } from './http-global-interceptors';
import { Pipe } from '../types/pipe';
import { HttpInterceptorConsumer } from './http-interceptor-consumer';
import { HttpPipeConsumer } from './http-pipe-consumer';
import { ControllerMetadata, HttpReflector, RouteMetadata } from '../http-reflector';
import { Handler, HttpRouter } from './http-router';
import { Method } from '../types/method';
import { Path } from '../types/path';

@Injectable()
export class HttpRouterExplorer implements OnApplicationBoot {
  constructor(
    private readonly httpInterceptorConsumer: HttpInterceptorConsumer,
    private readonly httpPipeConsumer: HttpPipeConsumer,
    private readonly httpRouter: HttpRouter,
    private readonly injector: Injector,
    private readonly logger: Logger,
    @Inject(HTTP_GLOBAL_INTERCEPTORS) private readonly httpGlobalInterceptors: HttpGlobalInterceptors,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const globalInterceptors = await this.resolveInterceptors(this.httpGlobalInterceptors);

    /** Mapping **/
    for (const controllerInstance of await this.injector.filter(provider => HttpReflector.hasControllerMetadata(provider))) {
      const controllerConstructor: Function = controllerInstance.constructor;
      const controllerPrototype: any = Object.getPrototypeOf(controllerInstance);
      const controllerMethodNames: string[] = Object
        .getOwnPropertyNames(controllerPrototype)
        .filter(name => name !== 'constructor' && typeof controllerPrototype[name] === 'function');

      for (const controllerMetadata of HttpReflector.getAllControllerMetadata(controllerConstructor)) {
        // controllerMetadata.prefix
        // controllerMetadata.interceptors
        const controllerInterceptors = await this.resolveInterceptors(controllerMetadata.interceptors);

        for (const controllerMethodName of controllerMethodNames) {
          const allParamMetadata = HttpReflector.getAllParamMetadata(controllerConstructor, controllerMethodName);

          for (const routeMetadata of HttpReflector.getAllRouteMetadata(controllerConstructor, controllerMethodName)) {
            // routeMetadata.method
            // routeMetadata.path
            // routeMetadata.interceptors

            const routeInterceptors = await this.resolveInterceptors(routeMetadata.interceptors);

            const handler: Handler = Object.getOwnPropertyDescriptor(controllerPrototype, controllerMethodName).value;
            const method: Method = routeMetadata.method;
            const path: Path = `/${ controllerMetadata.prefix }/${ routeMetadata.path }`.replace(/\/\//g, '/');


          }
        }


        // const controllerTypeRefInterceptors = await this.resolveInterceptors(
        //   controllerTypeRefMetadata.interceptors?.map(it => typeof it === 'function' ? { interceptor: it } : it) || [],
        // );

        // for (const requestMappingMetadata of getRequestMappingMetadata(controllerTypeRef) || []) {
        // const method: Method = requestMappingMetadata.method;
        // const path: Path = `/${ controllerTypeRefMetadata.prefix || '' }/${ requestMappingMetadata.path || '' }`.replace(/\/\//g, '/');
        // const handler: Handler = requestMappingMetadata.descriptor.value;

        // const routeInterceptors = await this.resolveInterceptors(
        //   requestMappingMetadata.interceptors?.map(it => typeof it === 'function' ? { interceptor: it } : it) || [],
        // );

        // const handlerArgumentFactories: { factory: RequestParamFactory, pipes: Pipe[] }[] = [];

        // for (const requestParamMetadata of (getRequestParamMetadata(controllerInstance, requestMappingMetadata.descriptor.value.name) || []).sort((a, b) => (a.index > b.index) ? 1 : -1)) {
        //
        //   const meta = this.httpMetadataAccessor.getRequestParamMetaType(requestMappingMetadata.descriptor.value, requestParamMetadata.index);
        //
        //   handlerArgumentFactories.push({
        //     factory: requestParamMetadata.factory,
        //     pipes: await this.resolvePipes(requestParamMetadata.pipes),
        //   });
        // }

        // this.httpRouter.route(
        //   method,
        //   path,
        //   (request: http.IncomingMessage, response: http.ServerResponse): Promise<unknown> => {
        //     return this.httpInterceptorConsumer.intercept(
        //       request,
        //       response,
        //       [
        //         ...globalInterceptors,
        //         ...controllerTypeRefInterceptors,
        //         ...routeInterceptors,
        //       ],
        //       (): Promise<unknown> => {
        //         // const args: any[] = handlerArgumentFactories.length <= 0 ? [request, response] : handlerArgumentFactories.map(it => {
        //         //   return this.httpPipeConsumer.apply(it.factory(request, response), it.pipes);
        //         // });
        //
        //         return Promise.resolve(handler.apply(controllerInstance, []));
        //       },
        //     );
        //   },
        // );

        // this.logger.trace(`Mapped {${ path }, ${ method }} HTTP route`, LOGGER_CONTEXT);
        // }
      }
    }
  }

  protected async resolveInterceptors(bindings: { args?: any[]; interceptor: Type<Interceptor>; }[]) {
    return await Promise.all(bindings.map(async binding => {
      const dependency = await this.injector.find<Interceptor>(provider => getProviderToken(provider) === binding.interceptor);

      if (!dependency) {
        throw new Error(`Cavia can't resolve interceptor '${ getProviderName(binding.interceptor) }'`);
      }

      return { args: binding.args, interceptor: dependency };
    }));
  }

  protected async resolvePipes(pipes: Type<Pipe>[]): Promise<Pipe[]> {
    return await Promise.all(pipes.map(async pipe => {
      const dependency = await this.injector.find<Pipe>(provider => getProviderToken(provider) === pipe);

      if (!dependency) {
        throw new Error(`Cavia can't resolve pipe '${ getProviderName(pipe) }'`);
      }

      return dependency;
    }));
  }
}
