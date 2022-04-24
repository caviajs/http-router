import http from 'http';
import { EndpointMetadata } from './main/types/endpoint';

declare module 'http' {
  export interface IncomingMessage {
    metadata: EndpointMetadata | undefined;
    params: Record<string, string>;
  }
}

http.IncomingMessage.prototype.metadata = undefined;
http.IncomingMessage.prototype.params = {};
