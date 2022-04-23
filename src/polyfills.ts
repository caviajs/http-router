import http from 'http';
import { ControllerMetadata } from './main/types/controller';

declare module 'http' {
  export interface IncomingMessage {
    metadata: ControllerMetadata | undefined;
    params: Record<string, string>;
  }
}

http.IncomingMessage.prototype.metadata = undefined;
http.IncomingMessage.prototype.params = {};
