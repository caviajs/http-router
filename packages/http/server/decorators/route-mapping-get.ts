import { Path } from '../types/path';
import { RouteMapping } from './route-mapping';

export function Get(path?: Path): MethodDecorator {
  return RouteMapping('GET', path || '/');
}
