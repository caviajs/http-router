import { HttpReflector } from '../http-reflector';

const DEFAULT_PATH: string = '/';

export function Get(path?: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      method: 'GET',
      path: path || DEFAULT_PATH,
    });
  };
}
