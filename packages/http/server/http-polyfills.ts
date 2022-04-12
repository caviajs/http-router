import http from 'http';

declare module 'http' {
  export interface Cookies {
    readonly [key: string]: string | string[];
  }

  export interface Params {
    readonly [key: string]: string;
  }

  export interface Query {
    readonly [key: string]: string | string[];
  }

  export interface IncomingMessage {
    body: any | undefined;
    cookies: Cookies;
    params: Params;
    path: string | undefined;
    query: Query;
  }
}

http.IncomingMessage.prototype.body = undefined;
http.IncomingMessage.prototype.cookies = {};
http.IncomingMessage.prototype.params = {};
http.IncomingMessage.prototype.path = undefined;
http.IncomingMessage.prototype.query = {};
