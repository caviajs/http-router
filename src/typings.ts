import { RouteMetadata, RoutePath } from './router/http-router';

declare module 'http' {
  export interface Cookies {
    [name: string]: string;
  }

  export interface Params {
    [key: string]: string;
  }

  export interface IncomingMessage {
    // todo: inferred by contract?
    body: any | undefined;
    cookies: Cookies | undefined;
    // headers: http.IncomingHttpHeaders;
    metadata: RouteMetadata | undefined;
    params: Params;
    path: RoutePath | undefined;
    // params: http.Params | { [name: string]: boolean | number; };
    query: { [name: string]: boolean | number | string; } | undefined;
  }
}
