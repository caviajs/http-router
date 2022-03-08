import { HttpReflector } from '../http-reflector';

const DEFAULT_PATH: string = '/';

export function Post(path?: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      method: 'POST',
      path: path || DEFAULT_PATH,
    });
  };
}
