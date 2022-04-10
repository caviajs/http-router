import { RouteParam } from './route-param';

export function Res(): ParameterDecorator {
  return RouteParam((request, response) => {
    return response;
  });
}
