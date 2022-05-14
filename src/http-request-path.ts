import http from 'http';
import { RoutePath } from './http-router';

declare module 'http' {
  export interface IncomingMessage {
    path: RoutePath | undefined;
  }
}

http.IncomingMessage.prototype.path = undefined;
