import { RouteParam } from './route-param';

export function Headers(name?: string): ParameterDecorator {
  return RouteParam(request => {
    return name ? request.headers[name] : request.headers;
  });
}
