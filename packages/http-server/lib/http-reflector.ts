import { Type } from '@caviajs/core';
import { Interceptor } from './types/interceptor';
import { Pipe } from './types/pipe';
import { Request } from './types/request';
import { Response } from './types/response';
import { Method } from './types/method';

export const CONTROLLER_METADATA: Symbol = Symbol('CONTROLLER_METADATA');
export const ROUTE_METADATA: Symbol = Symbol('ROUTE_METADATA');
export const ROUTE_PARAM_METADATA: Symbol = Symbol('PARAM_METADATA');

export class HttpReflector {
  /** Controller **/
  public static getAllControllerMetadata(controller: Function): ControllerMetadata[] {
    return Reflect.getMetadata(CONTROLLER_METADATA, controller) || [];
  }

  public static addControllerMetadata(controller: Function, meta: ControllerMetadata): void {
    const value: ControllerMetadata[] = [...this.getAllControllerMetadata(controller), meta];
    Reflect.defineMetadata(CONTROLLER_METADATA, value, controller);
  }

  public static hasControllerMetadata(controller: any): boolean {
    return Reflect.hasMetadata(CONTROLLER_METADATA, controller);
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
}

export interface ControllerMetadata {
  interceptors: { args: any[]; interceptor: Type<Interceptor>; }[];
  prefix: string;
}

export interface RouteMetadata {
  interceptors: { args: any[]; interceptor: Type<Interceptor>; }[];
  method: Method;
  path: string;
}

export interface RouteParamMetadata {
  factory: (request: Request, response: Response) => any;
  index: number;
  pipes: { args: any[]; pipe: Type<Pipe>; }[];
}
