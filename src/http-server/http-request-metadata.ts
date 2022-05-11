import http from 'http';

declare module 'http' {
  export interface IncomingMessage {
    metadata: any | undefined;
    // metadata: EndpointMetadata | undefined;
  }
}

http.IncomingMessage.prototype.metadata = undefined;
