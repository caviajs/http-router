import { Path } from '../types/path';
import { RouteMapping } from './route-mapping';

export function Put(path?: Path): MethodDecorator {
  return RouteMapping('PUT', path || '/');
}
