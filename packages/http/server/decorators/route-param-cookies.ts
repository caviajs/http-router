import { RouteParam } from './route-param';

export function Cookies(name?: string): ParameterDecorator {
  return RouteParam(request => {
    return name ? request.cookies[name] : request.cookies;
  });
}
