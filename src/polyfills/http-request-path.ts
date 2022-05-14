import http from 'http';
import { RoutePath } from '../router';

declare module 'http' {
  export interface IncomingMessage {
    path: RoutePath | undefined;
  }
}

http.IncomingMessage.prototype.path = undefined;
