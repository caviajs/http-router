import { Path } from '../types/path';
import { RouteMapping } from './route-mapping';

export function Delete(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('DELETE', path || '/');
}
