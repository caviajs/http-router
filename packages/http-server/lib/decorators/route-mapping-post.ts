import { Path } from '../types/path';
import { RouteMapping } from './route-mapping';

export function Post(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('POST', path || '/');
}
