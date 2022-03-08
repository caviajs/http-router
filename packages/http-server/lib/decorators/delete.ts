import { HttpReflector } from '../http-reflector';

const DEFAULT_PATH: string = '/';

export function Delete(path?: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      method: 'DELETE',
      path: path || DEFAULT_PATH,
    });
  };
}
