import { RouteParam } from './route-param';

export function Cookies(schema?: any): ParameterDecorator {
  return RouteParam(request => {
    return request.cookies;
  });
}
