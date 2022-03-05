import { Method } from '../providers/http-router';

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

export function Delete(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'DELETE' });
}

export function Get(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'GET' });
}

export function Head(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'HEAD' });
}

export function Options(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'OPTIONS' });
}

export function Patch(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'PATCH' });
}

export function Post(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'POST' });
}

export function Put(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'PUT' });
}

export interface RequestMappingMetadata extends RequestMappingOptions {
  descriptor: TypedPropertyDescriptor<any>;
}

export interface RequestMappingOptions {
  path?: string;
  method: Method;
}
