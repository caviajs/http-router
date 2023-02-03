import { RouteMetadata, RoutePath } from './http-router';

declare module 'http' {
  export interface Params {
    [key: string]: string;
  }

  export interface IncomingMessage {
    metadata: RouteMetadata | undefined;
    params: Params;
    path: RoutePath | undefined;
  }
}
