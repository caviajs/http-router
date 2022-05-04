import http from 'http';
import { EndpointMetadata } from '../types/endpoint';

declare module 'http' {
  export interface IncomingMessage {
    metadata: EndpointMetadata | undefined;
  }
}

http.IncomingMessage.prototype.metadata = undefined;
