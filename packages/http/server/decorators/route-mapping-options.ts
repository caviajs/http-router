import { Path } from '../types/path';
import { RouteMapping } from './route-mapping';

export function Options(path?: Path): MethodDecorator {
  return RouteMapping('OPTIONS', path || '/');
}
