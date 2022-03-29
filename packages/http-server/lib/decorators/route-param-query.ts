import { RouteParam } from './route-param';

export function Query(name?: string): ParameterDecorator {
  return RouteParam(request => {
    return name ? request.query[name] : request.query;
  });
}
