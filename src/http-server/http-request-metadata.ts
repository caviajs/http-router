import http from 'http';

declare module 'http' {
  export interface Metadata {
  }

  export interface IncomingMessage {
    metadata: Metadata | undefined;
  }
}

http.IncomingMessage.prototype.metadata = undefined;
