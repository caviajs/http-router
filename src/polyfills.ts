import http from 'http';
import { RouteMeta } from './main/providers/http-router';

declare module 'http' {
  export interface IncomingMessage {
    meta: RouteMeta;
    params: Record<string, string>;
    path: string | undefined;
  }
}

http.IncomingMessage.prototype.meta = {
  request: {
    body: undefined,
    cookies: undefined,
    headers: undefined,
    params: undefined,
    query: undefined,
  },
  responses: {},
};
http.IncomingMessage.prototype.params = {};
http.IncomingMessage.prototype.path = undefined;
