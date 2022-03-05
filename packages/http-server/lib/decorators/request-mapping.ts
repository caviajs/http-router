import { Type } from '@caviajs/core';

import { Method } from '../providers/http-router';
import { Interceptor } from '../types/interceptor';

export const REQUEST_MAPPING_METADATA = Symbol('REQUEST_MAPPING_METADATA');

export function getRequestMappingMetadata(target: object): RequestMappingMetadata[] | undefined {
  return Reflect.getMetadata(REQUEST_MAPPING_METADATA, target);
}

export function hasRequestMappingMetadata(target: object): boolean {
  return Reflect.hasMetadata(REQUEST_MAPPING_METADATA, target);
}

export function RequestMapping(options: RequestMappingOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const value: RequestMappingMetadata[] = [...(getRequestMappingMetadata(target.constructor) || []), {
      descriptor: descriptor,
      path: options.path,
      method: options.method,
    }];

    Reflect.defineMetadata(REQUEST_MAPPING_METADATA, value, target.constructor);
  };
}

export function Delete(options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Delete(path?: string, options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Delete(...args: any[]): MethodDecorator {
  const options: Omit<RequestMappingOptions, 'method' | 'path'> | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return RequestMapping({ ...options || {}, method: 'DELETE', path: path });
}

export function Get(options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Get(path?: string, options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Get(...args: any[]): MethodDecorator {
  const options: Omit<RequestMappingOptions, 'method' | 'path'> | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return RequestMapping({ ...options || {}, method: 'GET', path: path });
}

export function Head(options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Head(path?: string, options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Head(...args: any[]): MethodDecorator {
  const options: Omit<RequestMappingOptions, 'method' | 'path'> | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return RequestMapping({ ...options || {}, method: 'HEAD', path: path });
}

export function Options(options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Options(path?: string, options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Options(...args: any[]): MethodDecorator {
  const options: Omit<RequestMappingOptions, 'method' | 'path'> | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return RequestMapping({ ...options || {}, method: 'OPTIONS', path: path });
}

export function Patch(options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Patch(path?: string, options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Patch(...args: any[]): MethodDecorator {
  const options: Omit<RequestMappingOptions, 'method' | 'path'> | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return RequestMapping({ ...options || {}, method: 'PATCH', path: path });
}

export function Post(options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Post(path?: string, options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Post(...args: any[]): MethodDecorator {
  const options: Omit<RequestMappingOptions, 'method' | 'path'> | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return RequestMapping({ ...options || {}, path: path, method: 'POST' });
}

export function Put(options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Put(path?: string, options?: Omit<RequestMappingOptions, 'method' | 'path'>): MethodDecorator;
export function Put(...args: any[]): MethodDecorator {
  const options: Omit<RequestMappingOptions, 'method' | 'path'> | undefined = args.find(it => typeof it === 'object');
  const path: string | undefined = args.find(it => typeof it === 'string');

  return RequestMapping({ ...options || {}, path: path, method: 'PUT' });
}

export interface RequestMappingMetadata extends RequestMappingOptions {
  descriptor: TypedPropertyDescriptor<any>;
}

export interface RequestMappingInterceptorBinding {
  args?: any[];
  interceptor: Type<Interceptor>;
}

export interface RequestMappingOptions {
  interceptors?: Array<Type<Interceptor> | RequestMappingInterceptorBinding>;
  method: Method;
  path?: string;
}
