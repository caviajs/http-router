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

Object.defineProperty(http.IncomingMessage.prototype, 'params', {
  get: function (this: http.IncomingMessage): http.Params {
    if (this.metadata?.path) {
      if (!this['_params']) {
        this['_params'] = ((match(this.metadata.path)(url.parse(this.url).pathname) as MatchResult)?.params || {}) as any;
      }

      return this['_params'];
    }

    return {};
  },
});
