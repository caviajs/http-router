import * as http from 'http';
import * as url from 'url';
import { match, MatchResult } from 'path-to-regexp';

declare module 'http' {
  export interface Params {
    readonly [key: string]: string;
  }

  export interface IncomingMessage {
    readonly params: Params;
  }
}

const KEY: string = '_params';

Object.defineProperty(http.IncomingMessage.prototype, 'params', {
  get: function (this: http.IncomingMessage): http.Params {
    if (this.path) {
      if (!this[KEY]) {
        this[KEY] = ((match(this.path)(url.parse(this.url).pathname) as MatchResult)?.params || {}) as any;
      }

      return this[KEY];
    }

    return {};
  },
});
