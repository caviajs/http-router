import { RouteParam } from './route-param';

export function Req(): ParameterDecorator {
  return RouteParam(request => {
    return request;
  });
}
