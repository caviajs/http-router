import { RouteParam } from './route-param';

export function Query(name?: string): ParameterDecorator {
  return RouteParam(request => {
    return request.query;
  });
}
