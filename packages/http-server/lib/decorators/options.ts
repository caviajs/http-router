import { HttpReflector } from '../http-reflector';

const DEFAULT_PATH: string = '/';

export function Options(path?: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      method: 'OPTIONS',
      path: path || DEFAULT_PATH,
    });
  };
}
