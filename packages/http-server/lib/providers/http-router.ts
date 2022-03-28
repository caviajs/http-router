import { getProviderName, Injectable, Injector, OnApplicationBoot, Type } from '@caviajs/core';
import { Logger } from '@caviajs/logger';
import { match } from 'path-to-regexp';
import { parse } from 'url';
import { CONTROLLER_PATH_METADATA, ControllerPathMetadata } from '../decorators/controller';
import { ROUTE_MAPPING_METHOD_METADATA, ROUTE_MAPPING_PATH_METADATA, RouteMappingMethodMetadata, RouteMappingPathMetadata } from '../decorators/route-mapping';
import { ExecutionContext } from '../types/execution-context';
import { Interceptor } from '../types/interceptor';
import { Method } from '../types/method';
import { Path } from '../types/path';
import { Pipe } from '../types/pipe';
import { LOGGER_CONTEXT } from '../http-constants';

@Injectable()
export class HttpRouter implements OnApplicationBoot {
  protected readonly routes: Route[] = [];

  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
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
              routeHandlerParams: [
                { factory: '', pipes: [], metaType: '' },
              ],
              routeInterceptors: [],
            });
          }
        }
      }
    }
  }

  public addRoute(route: Route): void {
    if (!route.path.startsWith('/')) {
      route.path = `/${ route.path }`;
    }

    const matcher = match(route.path);

    if (this.routes.some(it => it.method === route.method && matcher(it.path))) {
      throw new Error(`Duplicated {${ route.path }, ${ route.method }} HTTP route`);
    }

    this.routes.push(route);
    this.logger.trace(`Mapped {${ route.path }, ${ route.method }} HTTP route`, LOGGER_CONTEXT);
  }

  public find(method: Method, url: string): Route | undefined {
    let route: Route | undefined;

    const pathname: string = parse(url).pathname;

    for (const it of this.routes.filter(r => r.method === method)) {
      if (match(it.path)(pathname)) {
        route = it;
        break;
      }
    }

    return route;
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

export interface Route {
  controllerConstructor: Type;
  controllerInstance: any;
  controllerInterceptors: { args: any[]; interceptor: Interceptor; }[];
  routeHandler: Function;
  routeInterceptors: { args: any[]; instance: Interceptor; }[];
  routeParams: { data: unknown; factory: (data: unknown, context: ExecutionContext) => any; index: number; }[];
  routePipes: { args: any[]; pipe: Pipe; index: number; }[];
  method: Method;
  path: Path;
}
