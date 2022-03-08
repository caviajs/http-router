import { HttpReflector } from '../http-reflector';

const DEFAULT_PATH: string = '/';

export function Head(path?: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      method: 'HEAD',
      path: path || DEFAULT_PATH,
    });
  };
}
