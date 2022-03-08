import { Type } from '@caviajs/core';
import { Interceptor } from './types/interceptor';
import { Pipe } from './types/pipe';
import { Method } from './types/method';
import { ExecutionContext } from './types/execution-context';

export const CONTROLLER_METADATA: Symbol = Symbol('CONTROLLER_METADATA');
export const CONTROLLER_INTERCEPTOR_METADATA: Symbol = Symbol('CONTROLLER_INTERCEPTOR_METADATA');
export const ROUTE_METADATA: Symbol = Symbol('ROUTE_METADATA');
export const ROUTE_INTERCEPTOR_METADATA: Symbol = Symbol('ROUTE_INTERCEPTOR_METADATA');
export const ROUTE_PARAM_METADATA: Symbol = Symbol('PARAM_METADATA');
export const ROUTE_PARAM_PIPE_METADATA: Symbol = Symbol('ROUTE_PARAM_PIPE_METADATA');

export class HttpReflector {
  /** Controller **/
  public static getAllControllerMetadata(controller: Function): ControllerMetadata[] {
    return Reflect.getMetadata(CONTROLLER_METADATA, controller) || [];
  }

  public static addControllerMetadata(controller: Function, meta: ControllerMetadata): void {
    const value: ControllerMetadata[] = [...this.getAllControllerMetadata(controller), meta];
    Reflect.defineMetadata(CONTROLLER_METADATA, value, controller);
  }

  /** Controller interceptor **/
  public static getAllControllerInterceptorMetadata(controller: Function): ControllerInterceptorMetadata[] {
    return Reflect.getMetadata(CONTROLLER_INTERCEPTOR_METADATA, controller) || [];
  }

  public static addControllerInterceptorMetadata(controller: Function, meta: ControllerInterceptorMetadata): void {
    const value: ControllerInterceptorMetadata[] = [...this.getAllControllerInterceptorMetadata(controller), meta];
    Reflect.defineMetadata(CONTROLLER_INTERCEPTOR_METADATA, value, controller);
  }

  public static hasControllerInterceptorMetadata(controller: any): boolean {
    return Reflect.hasMetadata(CONTROLLER_INTERCEPTOR_METADATA, controller);
  }

  /** Route **/
  public static getAllRouteMetadata(controller: Function, methodName: string): RouteMetadata[] {
    return Reflect.getMetadata(ROUTE_METADATA, controller, methodName) || [];
  }

  public static addRouteMetadata(controller: Function, methodName: string, meta: RouteMetadata): void {
    const value: RouteMetadata[] = [...this.getAllRouteMetadata(controller, methodName), meta];
    Reflect.defineMetadata(ROUTE_METADATA, value, controller, methodName);
  }

  public static hasRouteMetadata(controller: Function, methodName: string): boolean {
    return Reflect.hasMetadata(ROUTE_METADATA, controller, methodName);
  }

  /** Route interceptor **/
  public static getAllRouteInterceptorMetadata(controller: Function, methodName: string): RouteInterceptorMetadata[] {
    return Reflect.getMetadata(ROUTE_INTERCEPTOR_METADATA, controller, methodName) || [];
  }

  public static addRouteInterceptorMetadata(controller: Function, methodName: string, meta: RouteInterceptorMetadata): void {
    const value: RouteInterceptorMetadata[] = [...this.getAllRouteInterceptorMetadata(controller, methodName), meta];
    Reflect.defineMetadata(ROUTE_INTERCEPTOR_METADATA, value, controller, methodName);
  }

  public static hasRouteInterceptorMetadata(controller: Function, methodName: string): boolean {
    return Reflect.hasMetadata(ROUTE_INTERCEPTOR_METADATA, controller, methodName);
  }

  /** Route param **/
  public static getAllRouteParamMetadata(controller: Function, methodName: string): RouteParamMetadata[] {
    return Reflect.getMetadata(ROUTE_PARAM_METADATA, controller, methodName) || [];
  }

  public static addRouteParamMetadata(controller: Function, methodName: string, meta: RouteParamMetadata): void {
    const value: RouteParamMetadata[] = [...this.getAllRouteParamMetadata(controller, methodName), meta];
    Reflect.defineMetadata(ROUTE_PARAM_METADATA, value, controller, methodName);
  }

  public static hasRouteParamMetadata(controller: Function, methodName: string): boolean {
    return Reflect.hasMetadata(ROUTE_PARAM_METADATA, controller, methodName);
  }

  /** Route param pipe **/
  public static getAllRouteParamPipeMetadata(controller: Function, methodName: string): RouteParamPipeMetadata[] {
    return Reflect.getMetadata(ROUTE_PARAM_PIPE_METADATA, controller, methodName) || [];
  }

  public static addRouteParamPipeMetadata(controller: Function, methodName: string, meta: RouteParamPipeMetadata): void {
    const value: RouteParamPipeMetadata[] = [...this.getAllRouteParamPipeMetadata(controller, methodName), meta];
    Reflect.defineMetadata(ROUTE_PARAM_PIPE_METADATA, value, controller, methodName);
  }

  public static hasRouteParamPipeMetadata(controller: Function, methodName: string): boolean {
    return Reflect.hasMetadata(ROUTE_PARAM_PIPE_METADATA, controller, methodName);
  }
}

export interface ControllerMetadata {
  prefix: string;
}

export interface ControllerInterceptorMetadata {
  args: any[];
  interceptor: Type<Interceptor>;
}

export interface RouteMetadata {
  method: Method;
  path: string;
}

export interface RouteInterceptorMetadata {
  args: any[];
  interceptor: Type<Interceptor>;
}

export interface RouteParamMetadata {
  factory: (context: ExecutionContext) => any;
  index: number;
}

export interface RouteParamPipeMetadata {
  args: any[];
  index: number;
  pipe: Type<Pipe>;
}
