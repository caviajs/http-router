import { Path } from '../types/path';
import { RouteMapping } from './route-mapping';

export function Patch(path?: Path | Path[]): MethodDecorator {
  return RouteMapping('PATCH', path || '/');
}
