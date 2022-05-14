import http from 'http';
import { RouteMetadata } from './http-router';

declare module 'http' {
  export interface IncomingMessage {
    metadata: RouteMetadata | undefined;
  }
}

http.IncomingMessage.prototype.metadata = undefined;
