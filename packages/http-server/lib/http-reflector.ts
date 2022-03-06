import { Type } from '@caviajs/core';
import { Interceptor } from './types/interceptor';
import { Pipe } from './types/pipe';
import { Request } from './types/request';
import { Response } from './types/response';
import { Method } from './types/method';

export const CONTROLLER_METADATA: Symbol = Symbol('CONTROLLER_METADATA');
export const PARAM_METADATA: Symbol = Symbol('PARAM_METADATA');
export const ROUTE_METADATA: Symbol = Symbol('ROUTE_METADATA');

export class HttpReflector {
  /** Controller **/
  public static getAllControllerMetadata(target: Object): ControllerMetadata[] {
    return Reflect.getMetadata(CONTROLLER_METADATA, target) || [];
  }

  public static addControllerMetadata(target: Object, meta: ControllerMetadata): void {
    const value: ControllerMetadata[] = [...this.getAllControllerMetadata(target), meta];
    Reflect.defineMetadata(CONTROLLER_METADATA, value, target);
  }

  public static hasControllerMetadata(target: Object): boolean {
    return Reflect.hasMetadata(CONTROLLER_METADATA, target);
  }

  /** Param **/
  public static getAllParamMetadata(target: Object, propertyKey: string): ParamMetadata[] {
    return Reflect.getMetadata(PARAM_METADATA, target, propertyKey) || [];
  }

  public static addParamMetadata(target: Object, propertyKey: string, meta: ParamMetadata): void {
    const value: ParamMetadata[] = [...this.getAllParamMetadata(target, propertyKey), meta];
    Reflect.defineMetadata(PARAM_METADATA, value, target, propertyKey);
  }

  public static hasParamMetadata(target: Object, propertyKey: string): boolean {
    return Reflect.hasMetadata(PARAM_METADATA, target, propertyKey);
  }

  /** Route **/
  public static getAllRouteMetadata(target: Object, propertyKey: string): RouteMetadata[] {
    return Reflect.getMetadata(ROUTE_METADATA, target, propertyKey) || [];
  }

  public static addRouteMetadata(target: Object, propertyKey: string, meta: RouteMetadata): void {
    const value: RouteMetadata[] = [...this.getAllRouteMetadata(target, propertyKey), meta];
    Reflect.defineMetadata(ROUTE_METADATA, value, target, propertyKey);
  }

  public static hasRouteMetadata(target: Object, propertyKey: string): boolean {
    return Reflect.hasMetadata(ROUTE_METADATA, target, propertyKey);
  }
}

export interface ControllerMetadata {
  interceptors: { args: any[]; interceptor: Type<Interceptor>; }[];
  prefix: string;
}

export interface ParamMetadata {
  factory: (request: Request, response: Response) => any;
  index: number;
  pipes: { args: any[]; pipe: Type<Pipe>; }[];
}

export interface RouteMetadata {
  interceptors: { args: any[]; interceptor: Type<Interceptor>; }[];
  method: Method;
  path: string;
}
