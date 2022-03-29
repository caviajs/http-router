import { RouteParam } from './route-param';

export function Body(name?: string): ParameterDecorator {
  return RouteParam(request => {
    return name ? request.body[name] : request.body;
  });
}
