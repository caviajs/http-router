import http from 'http';
import { Route } from './router';

declare module 'http' {
  export interface IncomingMessage {
    route: Route | undefined;
  }
}

http.IncomingMessage.prototype.route = undefined;
