import { HttpReflector } from '../http-reflector';

const DEFAULT_PATH: string = '/';

export function Put(path?: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      method: 'PUT',
      path: path || DEFAULT_PATH,
    });
  };
}
