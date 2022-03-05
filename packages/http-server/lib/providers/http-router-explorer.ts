import { getProviderName, getProviderToken, Inject, Injectable, Injector, Logger, OnApplicationBoot, Type } from '@caviajs/core';
import http from 'http';

import { Handler, HttpRouter, Method, Path } from './http-router';
import { ControllerMetadata, getControllerMetadata, hasControllerMetadata } from '../decorators/controller';
import { getRequestMappingMetadata } from '../decorators/request-mapping';
import { LOGGER_CONTEXT } from '../http-constants';
import { RequestParamFactory } from '../decorators/request-param';
import { Interceptor } from '../types/interceptor';
import { HTTP_GLOBAL_INTERCEPTORS, HttpGlobalInterceptors } from './http-global-interceptors';
import { Pipe } from '../types/pipe';
import { HttpInterceptorConsumer } from './http-interceptor-consumer';
import { HttpPipeConsumer } from './http-pipe-consumer';
import { HttpMetadataAccessor } from './http-metadata-accessor';

@Injectable()
export class HttpRouterExplorer implements OnApplicationBoot {
  constructor(
    private readonly httpInterceptorConsumer: HttpInterceptorConsumer,
    // private readonly httpMetadataAccessor: HttpMetadataAccessor,
    private readonly httpPipeConsumer: HttpPipeConsumer,
    private readonly httpRouter: HttpRouter,
    private readonly injector: Injector,
    private readonly logger: Logger,
    @Inject(HTTP_GLOBAL_INTERCEPTORS) private readonly httpInterceptors: HttpGlobalInterceptors,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const globalInterceptors = await this.resolveInterceptors(this.httpInterceptors);

    for (const controllerInstance of await this.injector.filter(it => hasControllerMetadata(it))) {
      const controllerTypeRef: Type = controllerInstance.constructor;
      const controllerTypeRefMetadata: ControllerMetadata = getControllerMetadata(controllerTypeRef);

      const controllerTypeRefInterceptors = await this.resolveInterceptors(
        controllerTypeRefMetadata.interceptors?.map(it => typeof it === 'function' ? { interceptor: it } : it) || [],
      );

      for (const requestMappingMetadata of getRequestMappingMetadata(controllerTypeRef) || []) {
        const method: Method = requestMappingMetadata.method;
        const path: Path = `/${ controllerTypeRefMetadata.prefix || '' }/${ requestMappingMetadata.path || '' }`.replace(/\/\//g, '/');
        const handler: Handler = requestMappingMetadata.descriptor.value;

        const routeInterceptors = await this.resolveInterceptors(
          requestMappingMetadata.interceptors?.map(it => typeof it === 'function' ? { interceptor: it } : it) || [],
        );

        const handlerArgumentFactories: { factory: RequestParamFactory, pipes: Pipe[] }[] = [];

        // for (const requestParamMetadata of (getRequestParamMetadata(controllerInstance, requestMappingMetadata.descriptor.value.name) || []).sort((a, b) => (a.index > b.index) ? 1 : -1)) {
        //
        //   const meta = this.httpMetadataAccessor.getRequestParamMetaType(requestMappingMetadata.descriptor.value, requestParamMetadata.index);
        //
        //   handlerArgumentFactories.push({
        //     factory: requestParamMetadata.factory,
        //     pipes: await this.resolvePipes(requestParamMetadata.pipes),
        //   });
        // }

        this.httpRouter.route(
          method,
          path,
          (request: http.IncomingMessage, response: http.ServerResponse): Promise<unknown> => {
            return this.httpInterceptorConsumer.intercept(
              request,
              response,
              [
                ...globalInterceptors,
                ...controllerTypeRefInterceptors,
                ...routeInterceptors,
              ],
              (): Promise<unknown> => {
                // const args: any[] = handlerArgumentFactories.length <= 0 ? [request, response] : handlerArgumentFactories.map(it => {
                //   return this.httpPipeConsumer.apply(it.factory(request, response), it.pipes);
                // });

                return Promise.resolve(handler.apply(controllerInstance, []));
              },
            );
          },
        );

        this.logger.trace(`Mapped {${ path }, ${ method }} HTTP route`, LOGGER_CONTEXT);
      }
    }
  }

  protected async resolveInterceptors(bindings: Array<{ args?: any[]; interceptor: Type<Interceptor>; }>) {
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
