import http from 'http';
import { Route } from './main/types/route';

declare module 'http' {
  export interface IncomingMessage {
    params: Record<string, string>;
    route: Route | undefined;
  }
}

http.IncomingMessage.prototype.params = {};
http.IncomingMessage.prototype.route = undefined;
