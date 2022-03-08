import { HttpReflector } from '../http-reflector';

const DEFAULT_PATH: string = '/';

export function Patch(path?: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    HttpReflector.addRouteMetadata(target.constructor, propertyKey, {
      method: 'PATCH',
      path: path || DEFAULT_PATH,
    });
  };
}
