import { Path } from '../types/path';
import { RouteMapping } from './route-mapping';

export function Head(path?: Path): MethodDecorator {
  return RouteMapping('HEAD', path || '/');
}
