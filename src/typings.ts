import { RouteMetadata, RoutePath } from './router/http-router';

declare module 'http' {
  export interface Cookies {
    [name: string]: string;
  }

  export interface Params {
    [key: string]: string;
  }

  export interface IncomingMessage {
    cookies: Cookies | undefined;
    metadata: RouteMetadata | undefined;
    params: Params;
    path: RoutePath | undefined;

    // todo: inferred by contract?
    body: any | undefined;
    // headers: http.IncomingHttpHeaders;
    // params: http.Params | { [name: string]: boolean | number; };
    query: { [name: string]: boolean | number | string; } | undefined;
  }
}
